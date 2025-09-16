import { toastPlayers } from "server/toast/toast";
import { Combatant, isOwnerByPlayer, isPlayerCombatant, PlayerCombatant } from "./combatant";
import { CardController } from "./controllers/card-controller";
import { collectPlayerResponses } from "server/utils/collect-player-responses";
import { BF_INIT_TIME, PLAYER_TURN_TIME } from "server/constants/battle";
import { BattleClient, CardInput } from "shared/types/battle";
import { isCardCheck, remotes } from "shared/remotes/remo";
import { t } from "@rbxts/t";

export class Battle {
	// Metadata
	private participants = new Array<Player>();

	private playerTeam = new Array<Combatant>();
	private enemyTeam = new Array<Combatant>();

	private turn = 0;

	public constructor(playerTeam: Array<Combatant>, enemyTeam: Array<Combatant>) {
		this.playerTeam = playerTeam;
		this.enemyTeam = enemyTeam;

		// Populate participants
		for (const entity of playerTeam) {
			if (entity.controller instanceof CardController) {
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
		await this.processPlayerInputs();

		// Enemy & player team entity inputs
		await this.processEntityInputs();
		await this.calculateInputs();
		await this.replicateInputs();
	}

	private async processPlayerInputs() {
		const playerCombatants = this.playerTeam.filter(isPlayerCombatant);
		while (playerCombatants.size() > 0) {
			const { responses, pending } = await this.collectPlayersCardInput(
				playerCombatants.map((c) => c.controller.owner),
			);

			// Generate inputs for any pending
			for (const player of pending) responses.set(player, { kind: "EndTurn" });

			// If response is end turn then remove
			const inputsToProcess = new Array<{ player: Player; input: CardInput }>();
			for (const [player, input] of responses) {
				if (input.kind === "EndTurn") {
					playerCombatants.remove(
						playerCombatants.findIndex((c) => c.controller.owner === player),
					);
					continue;
				}
				inputsToProcess.push({ player: player, input: input });
			}

			// TODO: Process inputs (sort by priority, etc.)
			// print(inputsToProcess);
		}
		print("All players have ended their turn!");
	}

	private async processEntityInputs() {}

	private collectPlayersCardInput(players: Player[]) {
		toastPlayers(players, "Collecting inputs...");
		const initializer = remotes.SendReadyForPlayerInput;
		const receiver = remotes.ReceivePlayerInput;
		return collectPlayerResponses<CardInput>({
			players: players,
			collectionEvent: receiver,
			timeout: PLAYER_TURN_TIME,
			// TODO: This kinda is a repeat of the validator in remo (use Flamework and generics)
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
