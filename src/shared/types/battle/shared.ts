export type BaseStats = {
	maxHp: number;
	hp?: number;
	attack: number;
	defense: number;
	speed: number;
};

export type BattleStats = Omit<BaseStats, "hp"> & { hp: number };

export type CombatantClientShared = {
	stats: BattleStats;
	entity: string;
	slot: number;
	isEnemy: boolean;
};
