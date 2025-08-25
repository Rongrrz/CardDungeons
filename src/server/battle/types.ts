import { PlayerCardManager } from "./card-manager";

export type BattlePlayerStats = {
	hp: number;
	attack: number;
	defense: number;
};

export type BattlePlayer = {
	id: number;
	stats: BattlePlayerStats;
	cardManager: PlayerCardManager;
};
