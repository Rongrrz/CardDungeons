import { toastPlayers } from "server/toast/toast";
import { Combatant, isOwnerByPlayer, isPlayerCombatant, PlayerCombatant } from "./combatant";
import { CardController, isCardController } from "./controllers/card-controller";
import { collectPlayerResponses } from "server/utils/collect-player-responses";
import { BF_INIT_TIME, PLAYER_TURN_TIME } from "server/constants/battle";
import { BattleClient, CardInput, PlayCard } from "shared/types/battle";
import { isCardCheck, remotes } from "shared/remotes/remo";
import { t } from "@rbxts/t";
import { cards } from "shared/data/cards";
import { CardTargetType } from "shared/data/cards/card-target";
import { CardRoleType } from "shared/data/cards/card-role";

export class Battle {
	// Metadata
	private participants = new Array<Player>();

	private playerTeam = new Array<Combatant>();
	private enemyTeam = new Array<Combatant>();

	private turn = 0;

	public constructor(playerTeam: Array<Combatant>, enemyTeam: Array<Combatant>) {
		this.playerTeam = playerTeam;
		this.enemyTeam = enemyTeam;

		for (const entity of playerTeam) {
			if (isPlayerCombatant(entity)) {
				this.participants.push(entity.controller.owner);
			}
		}
	}

	private toClientRepresentation(): BattleClient {
		return {
			turn: this.turn,
			players: this.playerTeam.map((e) => e.toClientRepresentation()),
			enemies: this.enemyTeam.map((e) => e.toClientRepresentation()),
		};
	}

	public isBattleOver(): boolean {
		return false;
	}

	private endBattle() {
		// TODO: Fill
	}

	public async startBattle() {
		await this.processInitialize();
		await this.mainLoop();
		this.endBattle();
	}

	private async mainLoop() {
		while (!this.isBattleOver()) {
			await this.takeTurn();
		}
	}

	private processInitialize() {
		toastPlayers(this.participants, "Initializing battle...");
		const initializer = remotes.SendBattleSnapshot;
		const receiver = remotes.ReceiveBattleInitialized;
		return collectPlayerResponses({
			players: this.participants,
			collectionEvent: receiver,
			timeout: BF_INIT_TIME,
			initialization: (player) => initializer.fire(player, this.toClientRepresentation()),
		});
	}

	private async takeTurn() {
		this.turn++;
		// Player inputs
		await this.handlePlayerInputs();

		// Enemy & player team entity inputs
		await this.handleEntityInputs();
		await this.calculateInputs();
		await this.replicateInputs();
	}

	private async handlePlayerInputs() {
		const playerCombatants = this.playerTeam.filter(isPlayerCombatant);
		while (playerCombatants.size() > 0) {
			const { responses, pending } = await this.collectPlayersCardInput(
				playerCombatants.map((c) => c.controller.owner),
			);

			// Generate inputs for any pending
			for (const player of pending) responses.set(player, { kind: "EndTurn" });

			// If response is end turn then remove
			const inputsToProcess = new Array<{ player: Player; input: PlayCard }>();
			for (const [player, input] of responses) {
				if (input.kind === "EndTurn") {
					playerCombatants.remove(
						playerCombatants.findIndex((c) => c.controller.owner === player),
					);
					continue;
				}
				inputsToProcess.push({ player: player, input: input });
			}

			inputsToProcess.sort((a, b) => {
				const priorityA = cards[a.input.cardUsed.card].priority;
				const priorityB = cards[b.input.cardUsed.card].priority;
				return priorityA > priorityB;
			});

			await this.processPlayerInputs(inputsToProcess);
		}
		toastPlayers(this.participants, "All players have ended their turn!");
	}

	// TODO: Get targets and do stuff to targets
	// TODO: Add before/after card effect hooks
	// TODO: Replicate effects and await for players to finish
	private async processPlayerInputs(inputs: Array<{ player: Player; input: PlayCard }>) {
		for (const input of inputs) {
			// Remove card from user
			const userCombatant = this.playerTeam.find((c) => isOwnerByPlayer(c, input.player))!;
			userCombatant.controller.useCard(input.input.cardUsed);

			// TODO: Extract handling targets
			const card = cards[input.input.cardUsed.card];
			const targets = new Array<Combatant>();
			const targetType = card.cardTarget;
			switch (targetType) {
				case CardTargetType.All: {
					const allTargets = [...this.playerTeam, ...this.enemyTeam];
					for (const t of allTargets) targets.push(t);
					break;
				}
				case CardTargetType.User: {
					targets.push(userCombatant);
					break;
				}
				case CardTargetType.AllEnemyTeam: {
					for (const t of this.enemyTeam) targets.push(t);
					break;
				}
				case CardTargetType.SingleEnemy: {
					const enemy = this.enemyTeam.find((c) => c.slot === input.input.targetSlot)!;
					targets.push(enemy);
					break;
				}
				case CardTargetType.AllUserTeam: {
					for (const t of this.playerTeam) targets.push(t);
					break;
				}
				case CardTargetType.SingleUserTeam: {
					const entity = this.playerTeam.find((c) => c.slot === input.input.targetSlot)!;
					targets.push(entity);
					break;
				}
			}

			// TODO: Extract this damage stuff
			for (const t of targets) {
				switch (card.cardRole) {
					case CardRoleType.Attack: {
						const damageTaken = t.takeDamage(
							(card.base / 100) * (input.input.cardUsed.quality / 100),
							userCombatant,
						);
						print(`Damage taken: ${damageTaken}`);
						break;
					}
					case CardRoleType.Support: {
						// TODO: Fill this in
						break;
					}
				}
			}

			const output = `Player: ${input.player.Name} used Card: ${input.input.cardUsed.card}`;
			print(targets);
			toastPlayers(this.participants, output);
			task.wait(2);
		}
	}

	private async handleEntityInputs() {}

	private collectPlayersCardInput(players: Player[]) {
		toastPlayers(players, "Collecting inputs...");
		const initializer = remotes.SendReadyForPlayerInput;
		const receiver = remotes.ReceivePlayerInput;
		return collectPlayerResponses<CardInput>({
			players: players,
			collectionEvent: receiver,
			timeout: PLAYER_TURN_TIME,
			// TODO: This kinda is a repeat of the validator in remo (use Flamework and generics)
			// TODO: Change this validator be check if player has card
			validator: t.union(
				t.strictInterface({
					kind: t.literal("PlayCard"),
					cardUsed: isCardCheck,
					targetSlot: t.number,
				}),
				t.strictInterface({
					kind: t.literal("EndTurn"),
				}),
			),
			initialization: (player) => {
				const combatant = this.playerTeam.find((c): c is PlayerCombatant =>
					isOwnerByPlayer(c, player),
				);
				if (combatant === undefined) return print("Player combatant not found");
				const playerHand = combatant.controller.getHand();
				initializer.fire(player, playerHand);
			},
		});
	}

	private async calculateInputs() {
		toastPlayers(this.participants, "Calculating turn...");
		task.wait(2);
	}

	private async replicateInputs() {
		toastPlayers(this.participants, "Replicating turn fx...");
		task.wait(2);
	}
}
