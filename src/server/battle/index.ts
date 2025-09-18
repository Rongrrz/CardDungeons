import { toastPlayers } from "server/toast/toast";
import { Combatant, isOwnerByPlayer, isPlayerCombatant, PlayerCombatant } from "./combatant";
import { collectPlayerResponses } from "server/utils/collect-player-responses";
import { BF_INIT_TIME, PLAYER_TURN_TIME } from "server/constants/battle";
import { BattleClient, CardInput, PlayCardInput } from "shared/types/battle";
import { isCardCheck, remotes } from "shared/remotes/remo";
import { t } from "@rbxts/t";
import { cards } from "shared/data/cards";
import { getCardTargets } from "./targeting";
import { Card } from "shared/types/cards";

export class Battle {
	// Metadata
	private participants = new Array<Player>();

	private playerTeam = new Array<Combatant>();
	private enemyTeam = new Array<Combatant>();
	private turn = 0;

	public constructor(playerTeam: Array<Combatant>, enemyTeam: Array<Combatant>) {
		this.playerTeam = playerTeam;
		this.enemyTeam = enemyTeam;
		this.participants = this.extractPlayersOfTeam(this.playerTeam);
	}

	// SECTION Battle - Public API
	public async startBattle() {
		await this.initPhase();
		while (this.isBattleOver() === false) await this.takeTurn();
		this.endBattle();
	}
	// !SECTION

	// SECTION Battle - Phases
	private initPhase() {
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
		await this.playerPhase();
		await this.entityPhase();
		task.wait(2); // Hardcoded wait-time between turns, remove later.
	}

	private async playerPhase() {
		const playerCombatants = this.getAlivePlayerCombatants(this.playerTeam);
		while (playerCombatants.size() > 0) {
			const activePlayers = playerCombatants.map((c) => c.controller.owner);
			const { responses, pending } = await this.collectPlayersCardInput(activePlayers);
			const inputsToProcess = this.filterPlayerInputs(playerCombatants, responses, pending);
			await this.processBatchPlayerAction(inputsToProcess);
		}
		toastPlayers(this.participants, "All players have ended their turn!");
		print("Player & enemy team after player phase");
		print(this.playerTeam);
		print(this.enemyTeam);
	}

	private async entityPhase() {
		// TODO: Enemies, pets...
	}

	private endBattle() {
		// TODO: Fill
	}
	// !SECTION

	// SECTION Battle - Helper functions
	// TODO: Some helper functions are actual key components of gameplay
	// Extract those to their own section
	public isBattleOver(): boolean {
		return false;
	}

	private toClientRepresentation(): BattleClient {
		return {
			turn: this.turn,
			players: this.playerTeam.map((e) => e.toClientRepresentation()),
			enemies: this.enemyTeam.map((e) => e.toClientRepresentation()),
		};
	}

	private extractPlayersOfTeam(team: Combatant[]): Array<Player> {
		const players = new Array<Player>();
		for (const c of team) if (isPlayerCombatant(c)) players.push(c.controller.owner);
		return players;
	}

	private getAlivePlayerCombatants(team: Combatant[]): Array<PlayerCombatant> {
		return this.playerTeam.filter(
			(c): c is PlayerCombatant => isPlayerCombatant(c) && c.isAlive,
		);
	}

	private getPlayerCombatant(
		playerTeam: Combatant[],
		player: Player,
	): PlayerCombatant | undefined {
		return playerTeam.find((c) => isOwnerByPlayer(c, player));
	}

	private filterPlayerInputs(
		playerCombatants: PlayerCombatant[],
		responses: Map<Player, CardInput>,
		pending: Array<Player>,
	): Array<PlayCardInput> {
		const result = new Array<PlayCardInput>();
		for (const player of pending) responses.set(player, { kind: "EndTurn" });
		for (const [player, input] of responses) {
			if (input.kind === "EndTurn") {
				playerCombatants.remove(
					playerCombatants.findIndex((c) => c.controller.owner === player),
				);
				continue;
			}
			result.push({ player: player, action: input });
		}
		result.sort((a, b) => {
			const priorityA = cards[a.action.cardUsed.card].priority;
			const priorityB = cards[b.action.cardUsed.card].priority;
			return priorityA > priorityB;
		});
		return result;
	}

	private async processBatchPlayerAction(batch: Array<PlayCardInput>) {
		for (const a of batch) await this.processSinglePlayerAction(a);
	}

	private async processSinglePlayerAction(input: PlayCardInput) {
		const user = this.getPlayerCombatant(this.playerTeam, input.player);
		if (user === undefined) return warn(`No combatant found for player ${input.player.Name}`);

		user.controller.spendCard(input.action.cardUsed);

		const card = cards[input.action.cardUsed.card];
		const targets = getCardTargets(
			card.cardTarget,
			user,
			input.action.targetSlot,
			this.playerTeam,
			this.enemyTeam,
		);

		// TODO: Add before/after card effect hooks
		const replicationInfo = this.resolveCardUse(input.action.cardUsed, user, targets);

		// TODO: Replicate effects and await for players to finish
		const output = `Player ${input.player.Name} used card ${input.action.cardUsed.card}`;
		toastPlayers(this.participants, output);
		task.wait(2); // Artificial replication wait-time
	}

	private resolveCardUse(cardUsed: Card, user: PlayerCombatant, targets: Combatant[]) {
		const cardInfo = cards[cardUsed.card];
		const onUse = cardInfo.onUse;
		if (onUse === undefined) return warn(`Resolver for card ${cardUsed.card} does not exist.`);
		onUse(cardInfo, cardUsed.quality, user, targets);
	}
	// !SECTION

	// TODO: Extract I guess
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
}
