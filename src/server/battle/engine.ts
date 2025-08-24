import { Players, ReplicatedStorage } from "@rbxts/services";
import { CardName } from "shared/data/cards/codenames";
import { Queue } from "shared/dsa/queue";

import { EnemyName } from "shared/data/enemies/codenames";
import { toastAllPlayers } from "server/toast/toast";
import { EnemyStats } from "shared/data/enemies/types";
import { PlayerCardManager } from "./card-manager";

// We know for sure that there will only be one battle at once
type Card = {
	name: CardName;
	multiplier: number;
};

type BattlePlayerStats = {
	hp: number;
	attack: number;
	defense: number;
};
type BattlePlayer = {
	id: number;
	stats: BattlePlayerStats;
	deck: PlayerCardManager;
};

type BattleEnemy = {
	name: EnemyName;
	stats: EnemyStats;
};

type EnemyData =
	| {
			type: "continuous";
			maxConcurrentEnemy: number;
			enemies: Queue<BattleEnemy>;
	  }
	| {
			type: "waves";
			enemies: Queue<Array<BattleEnemy>>;
	  };

export type BattleSetUpData = {
	playerData: Array<BattlePlayer>;
	enemyData: EnemyData;
};

export type Battle = {
	id: number;
	turn: number;
	state: BattleState;
	players: Array<BattlePlayer>;
	enemies: Array<BattleEnemy>;
	enemyData: EnemyData;
};

let battleId = 0;
let currentBattle: Battle | undefined = undefined;
const PLAYER_TURN_TIME = 8;

function setUpBattle(data: BattleSetUpData) {
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

	// Set up the battle
	const battle: Battle = {
		id: battleId++,
		turn: 0,
		state: "start",
		players: data.playerData,
		enemies: enemies,
		enemyData: data.enemyData,
	};
	currentBattle = battle;
	toastAllPlayers("Battle set up finished!");
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
			ReplicatedStorage.Remotes.InitializeBattleVisuals.FireClient(player);
		});

		Promise.delay(5).andThen(finish);
	});
	return { results, notResponded };
}

function processStartBattle() {
	// Initialize battlefield and character assets for users
	// TODO: -> Implement client-side receiving
	// TODO: -> What happens for players who are NOT initialized?
	toastAllPlayers("Initializing battlefield and character assets...");
	getPlayerInitialized();

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

		Promise.delay(PLAYER_TURN_TIME).andThen(finish);
	});
	return { results, notResponded };
}

async function processPlayerTurn() {
	// TODO: Get all player input
	toastAllPlayers("Awaiting for player inputs...");
	const { results, notResponded } = await getPlayerInput();
	// print(results);
	// print(notResponded);
	toastAllPlayers("Player inputs received, now processing");

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
	toastAllPlayers("Enemy inputs generated, calculated, replicated...");

	// TODO: Next battle state (ended/player)
	nextBattleState("playerTurn");
}

function processEndBattle() {
	// TODO: Replicate client effects
	print("Finished");
}

type BattleState = "start" | "playerTurn" | "enemyTurn" | "ended";
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

// Create a battle
task.wait(3);
toastAllPlayers("Creating a battle");
setUpBattle({
	enemyData: {
		type: "continuous",
		enemies: new Queue(),
		maxConcurrentEnemy: 0,
	},
	playerData: [],
});
