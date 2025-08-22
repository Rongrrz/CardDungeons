import { ReplicatedStorage } from "@rbxts/services";
import { CardName } from "shared/info/cards/card-names";
import { Queue } from "shared/dsa/queue";
import { EnemyStats } from "shared/info/enemies/enemies";
import { EnemyName } from "shared/info/enemies/enemy-names";

// We know for sure that there will only be one battle at once
type Card = {
	name: CardName;
	multiplier: number;
};

type BattleState = "start" | "playerTurn" | "enemyTurn" | "ended";

type BattlePlayerStats = {
	hp: number;
	attack: number;
	defense: number;
};
type BattlePlayer = {
	id: number;
	stats: BattlePlayerStats;
	deck: Array<Card>;
	hand: Array<Card>;
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
const PLAYER_TURN_TIME = 30;

function setUpBattle(data: BattleSetUpData) {
	// Populate enemies array with an initial batch of enemies
	const enemies = new Array<BattleEnemy>();
	switch (data.enemyData.type) {
		case "continuous": {
			for (
				let index = 0;
				index < data.enemyData.maxConcurrentEnemy;
				index++
			) {
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
}

function processBattleState() {
	switch (currentBattle!.state) {
		case "start": {
			processStartBattle();
			break;
		}
		case "playerTurn": {
			processPlayerTurn();
			break;
		}
		case "enemyTurn": {
			processEnemyTurn();
			break;
		}
		case "ended": {
			processEndBattle();
			break;
		}
	}
}

function nextBattleState(state: BattleState) {
	currentBattle!.state = state;
	processBattleState();
}

function processStartBattle() {
	// TODO: Initialize battlefield and character assets for users (and wait for them to say yes)
	// TODO: Do any start of battle functions (boss summoning enemies, etc.) (if func, wait for players again)

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

		const connection =
			ReplicatedStorage.Remotes.PlayerInputRemote.OnServerEvent.Connect(
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
	const { results, notResponded } = await getPlayerInput();

	// TODO: Do stuff with player input
	// TODO: Replicate client effects
	print(results);
	print(notResponded);

	// TODO: Next battle state (ended/enemy)
	nextBattleState("enemyTurn");
}

async function processEnemyTurn() {
	// TODO: Generate enemy input (sort enemy input by priority)
	// TODO: Do stuff with enemy input
	// TODO: Replicate client effects

	// TODO: Next battle state (ended/player)
	nextBattleState("playerTurn");
}

function processEndBattle() {
	// TODO: Replicate client effects
	print("Finished");
}
