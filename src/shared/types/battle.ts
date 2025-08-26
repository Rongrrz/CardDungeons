import { EnemyName } from "shared/data/enemies/codenames";
import { EnemyStats } from "shared/data/enemies/types";
import { Queue } from "shared/dsa/queue";
import { Card } from "./cards";
import { IPlayerCardManager } from "shared/interfaces/player-card-manager";

export type BattleState = "start" | "input" | "calculate" | "replicate" | "ended";

export type BattlePlayerStats = {
	hp: number;
	attack: number;
	defense: number;
};

export type BattlePlayer = {
	id: number;
	stats: BattlePlayerStats;
	cardManager: IPlayerCardManager;
};

export type PlayerData = {
	id: number;
	stats: BattlePlayerStats;
	deck: Array<Card>;
};

export type BattleEnemy = {
	name: EnemyName;
	stats: EnemyStats;
};

type ContinuousEnemies = {
	type: "continuous";
	maxConcurrentEnemy: number;
	enemies: Queue<BattleEnemy>;
};

type EnemyWaves = {
	type: "waves";
	enemies: Queue<Array<BattleEnemy>>;
};
export type EnemyData = ContinuousEnemies | EnemyWaves;

export type BattleSetUpData = {
	playerData: Array<PlayerData>;
	enemyData: EnemyData;
};

export type Battle = {
	id: number;
	turn: number;
	state: BattleState;
	players: Array<BattlePlayer>;
	enemies: Array<BattleEnemy>;
	enemyData: EnemyData;
	participants: Array<Player>;
};
