import { ReplicatedStorage } from "@rbxts/services";
import { toastPlayer, toastPlayers } from "server/toast/toast";
import { PlayerCardManager } from "./player-card-manager";
import { BF_INIT_TIME, PLAYER_TURN_TIME } from "server/constants/battle";
import {
	BattleEnemy,
	BattleSetUpData,
	Battle,
	BattleState,
	BattlePlayer,
} from "shared/types/battle";
import { collectPlayerResponses } from "server/utils/collect-player-responses";

// We know for sure that there will only be one battle at once

let battleId = 0;
let currentBattle: Battle | undefined = undefined;

export function createBattle(data: BattleSetUpData) {
	// Populate enemies array with an initial batch of enemies
	const enemies = new Array<BattleEnemy>();
	switch (data.enemyData.type) {
		case "continuous": {
			for (let index = 0; index < data.enemyData.maxConcurrentEnemy; index++) {
				enemies.push(data.enemyData.enemies.pop()!);
			}
			break;
		}
		case "waves": {
			const wave = data.enemyData.enemies.pop() as Array<BattleEnemy>;
			for (const enemy of wave) enemies.push(enemy);
			break;
		}
	}

	// Create a card manager for each player
	const players = new Map<number, BattlePlayer>();
	data.playerData.forEach((d) => {
		players.set(d.id, {
			stats: d.stats,
			cardManager: new PlayerCardManager(d.deck),
		});
	});

	// Set up the battle
	const battle: Battle = {
		id: ++battleId,
		turn: 0,
		state: "start",
		players: players,
		enemies: enemies,
		enemyData: data.enemyData,
	};
	currentBattle = battle;
	toastPlayers(currentBattle.players, "Battle set up finished!");
	processBattleState();
}

function nextBattleState(state: BattleState) {
	currentBattle!.state = state;
	processBattleState();
}

async function processStartBattle() {
	// Initialize battlefield and character assets for users
	// TODO: -> Implement client-side receiving
	// TODO: -> What happens for players who are NOT initialized?
	toastPlayers(currentBattle!.players, "Initializing battlefield and character assets...");
	await getPlayerInitialized();

	// TODO: Enemy head-start turn, special-effects (Wait for players again)

	nextBattleState("input");
}

async function getPlayerInitialized() {
	const remote = ReplicatedStorage.Remotes.InitializeBattleVisuals;
	return collectPlayerResponses({
		players: currentBattle!.players,
		collectionEvent: remote,
		timeout: BF_INIT_TIME,
		initialization: (player) => remote.FireClient(player, currentBattle!),
	});
}

async function getPlayerInput() {
	const remote = ReplicatedStorage.Remotes.ReceivePlayerInput;
	return collectPlayerResponses({
		players: currentBattle!.players,
		collectionEvent: remote,
		timeout: PLAYER_TURN_TIME,
		initialization: (player) => {
			const playerHand = currentBattle!.players.get(player.UserId)!.cardManager.getHand();
			remote.FireClient(player, playerHand);
		},
	});
}

// TODO: Add battle-ended check
async function collectTurnInput() {
	// TODO: Get player and enemy inputs with Promise.all
	toastPlayers(currentBattle!.players, "Collecting inputs...");
	const { responses, pending } = await getPlayerInput();

	// TODO: Calculate results of player inputs (damage, heal, buffs, etc.)
	// TODO: Replicate the calculated results to clients
	// TODO: Check for battle end status

	// TODO: Next battle state (ended/enemy)
	nextBattleState("calculate");
}

function calculateTurnInput() {
	toastPlayers(currentBattle!.players, "Calculating turn");
	task.wait(2);
	nextBattleState("replicate");
}

function replicateTurnEffects() {
	toastPlayers(currentBattle!.players, "Replicating turn effects");
	task.wait(2);
	nextBattleState("input");
}

function processEndBattle() {
	// TODO: Replicate end-of-battle effects
	print("Finished");
}

const battleStateHandlers: Record<BattleState, Callback> = {
	start: processStartBattle,
	input: collectTurnInput,
	calculate: calculateTurnInput,
	replicate: replicateTurnEffects,
	ended: processEndBattle,
} as const;

function processBattleState() {
	const state = currentBattle!.state;
	const handler = battleStateHandlers[state];
	if (handler) handler();
}
