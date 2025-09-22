import { toastPlayers } from "server/toast/toast";
import { Combatant, isOwnerByPlayer, isPlayerCombatant, PlayerCombatant } from "./combatant";
import { collectPlayerResponses } from "server/utils/collect-player-responses";
import { BF_INIT_TIME, PLAYER_TURN_TIME } from "server/constants/battle";
import {
	BattleClient,
	CardInput,
	OnUseReplicationInfo,
	PlayCardInput,
} from "shared/types/battle/battle";
import { isCardCheck, remotes } from "shared/remotes/remo";
import { t } from "@rbxts/t";
import { CARD } from "shared/data/cards";
import { getCardTargets } from "./targeting";
import { Card } from "shared/types/battle/cards";
import { ArrayUtilities } from "@rbxts/luau-polyfill";
import { CardName } from "shared/data/cards/codenames";
import { CARD_RESOLVERS } from "./card-resolvers";

export class Battle {
	// Metadata
	private participants = new Array<Player>();
	private combatants = new Array<Combatant>();
	private turn = 0;

	// TODO: Find a way to say that enemyTeam Combatants isEnemy must be true
	public constructor(playerTeam: Array<Combatant>, enemyTeam: Array<Combatant>) {
		this.combatants = ArrayUtilities.concat(playerTeam, enemyTeam);
		this.participants = this.extractPlayersOfTeam(this.combatants);
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
		const playerCombatants = this.getAlivePlayerCombatants();
		while (playerCombatants.size() > 0) {
			const activePlayers = playerCombatants.map((c) => c.controller.owner);
			const { responses, pending } = await this.collectPlayersCardInput(activePlayers);
			const inputsToProcess = this.filterPlayerInputs(playerCombatants, responses, pending);
			await this.processBatchPlayerAction(inputsToProcess);
		}
		toastPlayers(this.participants, "All players have ended their turn!");
		print(this.combatants);
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
			combatants: this.combatants.map((c) => c.toClientRepresentation()),
		};
	}

	private extractPlayersOfTeam(team: Combatant[]): Array<Player> {
		const players = new Array<Player>();
		for (const c of team) if (isPlayerCombatant(c)) players.push(c.controller.owner);
		return players;
	}

	private getAlivePlayerCombatants(): Array<PlayerCombatant> {
		return this.combatants.filter(
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
			const priorityA = CARD[a.action.cardUsed.card].priority;
			const priorityB = CARD[b.action.cardUsed.card].priority;
			return priorityA > priorityB;
		});
		return result;
	}

	private async processBatchPlayerAction(batch: Array<PlayCardInput>) {
		for (const a of batch) await this.processSinglePlayerAction(a);
	}

	private async processSinglePlayerAction(input: PlayCardInput) {
		const user = this.getPlayerCombatant(this.combatants, input.player);
		if (user === undefined) return warn(`No combatant found for player ${input.player.Name}`);

		user.controller.spendCard(input.action.cardUsed);

		const card = CARD[input.action.cardUsed.card];
		const targets = getCardTargets(
			card.cardTarget,
			user,
			input.action.targetSlot,
			this.combatants,
		);

		// TODO: Add before/after card effect hooks
		const replicationInfo = this.resolveCardUse(input.action.cardUsed, user, targets);

		// TODO: Replicate effects and await for players to finish
		const output = `Player ${input.player.Name} used card ${input.action.cardUsed.card}`;
		toastPlayers(this.participants, output);
		return await this.awaitOnUseReplication(
			input.action.cardUsed.card,
			input.action.targetSlot,
			replicationInfo,
		);
	}

	private resolveCardUse(
		cardUsed: Card,
		user: PlayerCombatant,
		targets: Combatant[],
	): OnUseReplicationInfo {
		const onUseResolver = CARD_RESOLVERS[cardUsed.card];
		if (onUseResolver === undefined) {
			warn(`Resolver for card ${cardUsed.card} does not exist.`);
			return [];
		}
		return onUseResolver(cardUsed.card, cardUsed.quality, user, targets);
	}
	// !SECTION

	private awaitOnUseReplication(card: CardName, slot: number, info: OnUseReplicationInfo) {
		const initializer = remotes.ReplicateCardOnUse;
		const receiver = remotes.ReplicateCardOnUseFinished;
		return collectPlayerResponses({
			players: this.participants,
			collectionEvent: receiver,
			timeout: 1,
			initialization: (player) => initializer.fire(player, card, slot, info),
		});
	}

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
				const combatant = this.combatants.find((c): c is PlayerCombatant =>
					isOwnerByPlayer(c, player),
				);
				if (combatant === undefined) return print("Player combatant not found");
				const playerHand = combatant.controller.getHand();
				initializer.fire(player, playerHand);
			},
		});
	}
}
