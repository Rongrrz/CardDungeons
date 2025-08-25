import { Players, ReplicatedStorage } from "@rbxts/services";
import { toastPlayers } from "server/toast/toast";
import { PlayerCardManager } from "./card-manager";
import { BF_INIT_TIME, PLAYER_TURN_TIME } from "server/constants/battle";
import { Battle, BattleEnemy, BattleSetUpData, BattleState } from "shared/types/battle";

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
	const playerIds: Array<number> = [];
	const players = data.playerData.map((d) => {
		playerIds.push(d.id);
		return {
			id: d.id,
			stats: d.stats,
			cardManager: new PlayerCardManager(d.deck),
		};
	});

	// Set up the battle
	const battle: Battle = {
		id: ++battleId,
		turn: 0,
		state: "start",
		players: players,
		enemies: enemies,
		enemyData: data.enemyData,
		playerIds: playerIds,
	};
	currentBattle = battle;
	toastPlayers(currentBattle.playerIds, "Battle set up finished!");
	processBattleState();
}

function nextBattleState(state: BattleState) {
	currentBattle!.state = state;
	processBattleState();
}

// TODO: This function is dangerously similar to getPlayerInput
async function getPlayerInitialized() {
	const results: Record<number, string | undefined> = {};
	const playerIds = currentBattle!.players.map((player) => player.id);
	const notResponded = new Set(playerIds);
	await new Promise<void>((resolve) => {
		let finished = false;
		const finish = () => {
			if (finished) {
				print("Forced-finish failed: Already finished.");
				return;
			}
			finished = true;
			connection.Disconnect();
			resolve();
		};

		const connection = ReplicatedStorage.Remotes.InitializeBattleVisuals.OnServerEvent.Connect(
			(player, data) => {
				if (!notResponded.has(player.UserId)) return;
				// TODO: Verify data integrity
				// Populate data into results
				results[player.UserId] = data as string;

				notResponded.delete(player.UserId);
				if (notResponded.size() === 0) finish();
			},
		);

		playerIds.forEach((playerId) => {
			// TODO: Rename all occurrences of playerId into userId
			const player = Players.GetPlayerByUserId(playerId);
			if (!player) return; // TODO: What happens when user leaves midway?
			ReplicatedStorage.Remotes.InitializeBattleVisuals.FireClient(player, currentBattle);
		});

		Promise.delay(BF_INIT_TIME).andThen(finish);
	});
	return { results, notResponded };
}

async function processStartBattle() {
	// Initialize battlefield and character assets for users
	// TODO: -> Implement client-side receiving
	// TODO: -> What happens for players who are NOT initialized?
	toastPlayers(currentBattle!.playerIds, "Initializing battlefield and character assets...");
	await getPlayerInitialized();

	// TODO: Do any start of battle functions (boss summoning enemies, etc.) (if func, wait for players again)
	// Empty/No-code for now

	// TODO: Next battle state (player/enemy, depends on type of battle, any bosses, etc.)
	nextBattleState("playerTurn");
}

async function getPlayerInput() {
	const results: Record<number, string | undefined> = {};
	const playerIds = currentBattle!.players.map((player) => player.id);
	const notResponded = new Set(playerIds);
	await new Promise<void>((resolve) => {
		let finished = false;
		const finish = () => {
			if (finished) {
				print("Already finished");
				return;
			}
			finished = true;
			connection.Disconnect();
			resolve();
		};

		const connection = ReplicatedStorage.Remotes.ReceivePlayerInput.OnServerEvent.Connect(
			(player, data) => {
				if (!notResponded.has(player.UserId)) return;
				// TODO: Verify data integrity
				// Populate data into results
				results[player.UserId] = data as string;

				notResponded.delete(player.UserId);
				if (notResponded.size() === 0) finish();
			},
		);

		playerIds.forEach((playerId) => {
			// TODO: Rename all occurrences of playerId into userId
			const player = Players.GetPlayerByUserId(playerId);
			if (!player) return; // TODO: What happens when user leaves midway?
			ReplicatedStorage.Remotes.ReceivePlayerInput.FireClient(player, currentBattle);
		});

		Promise.delay(PLAYER_TURN_TIME).andThen(finish);
	});
	return { results, notResponded };
}

async function processPlayerTurn() {
	// TODO: Get all player input
	toastPlayers(currentBattle!.playerIds, "Awaiting for player inputs...");
	const { results, notResponded } = await getPlayerInput();
	// print(results);
	// print(notResponded);
	toastPlayers(currentBattle!.playerIds, "Player inputs received, now processing");

	// TODO: Calculate results of player inputs (damage, heal, buffs, etc.)
	// TODO: Replicate the calculated results to clients
	// TODO: Check for battle end status

	// TODO: Next battle state (ended/enemy)
	nextBattleState("enemyTurn");
}

async function processEnemyTurn() {
	// TODO: Generate enemy input (sort enemy input by priority)
	// TODO: Do stuff with enemy input
	// TODO: Replicate client effects
	// TODO: Check for battle end status
	toastPlayers(currentBattle!.playerIds, "Enemy inputs generated, calculated, replicated...");

	// TODO: Next battle state (ended/player)
	nextBattleState("playerTurn");
}

function processEndBattle() {
	// TODO: Replicate client effects
	print("Finished");
}

const battleStateHandlers: Record<BattleState, Callback> = {
	start: processStartBattle,
	playerTurn: processPlayerTurn,
	enemyTurn: processEnemyTurn,
	ended: processEndBattle,
} as const;

function processBattleState() {
	const state = currentBattle!.state;
	const handler = battleStateHandlers[state];
	if (handler) handler();
}
