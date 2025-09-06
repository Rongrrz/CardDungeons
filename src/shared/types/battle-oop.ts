import { Card } from "./cards";

export type BaseStats = {
	maxHp: number;
	hp?: number;
	attack: number;
	defense: number;
	speed: number;
};

export type BattleStats = Omit<BaseStats, "hp"> & { hp: number };

type CombatantClientShared = {
	stats: BattleStats;
};

type CombatantClientEntity = CombatantClientShared & {};

type CombatantClientPlayer = CombatantClientShared & {
	hand?: Array<Card>;
	ownerUserId?: number;
};

export type CombatantClient = CombatantClientEntity | CombatantClientPlayer;

export type BattleClient = {
	turn: number;
	players: Array<CombatantClient>;
	enemies: Array<CombatantClient>;
};
