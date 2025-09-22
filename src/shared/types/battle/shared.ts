import { ModelName } from "../utils";

export type BaseStats = {
	maxHp: number;
	hp?: number;
	attack: number;
	defense: number;
	speed: number;
};

export type BattleStats = Omit<BaseStats, "hp"> & { hp: number };

export type ICombatant = {
	getStats(): Readonly<BattleStats>;
	isEnemy: boolean;
	slot: number;
	takeDamage(multiplier: number, attacker: ICombatant): number;
};

export type numberType = "normal" | "crit" | "heal";

export type OnUseReplicationInfo = {
	slot: number;
	isEnemy: boolean;
	numbers?: Array<{
		number: number;
		numberType: numberType;
	}>;
	finalHp: number;
	finalMaxHp: number;
}[];

export type CombatantClientShared = {
	stats: BattleStats;
	model: ModelName;
	slot: number;
	isEnemy: boolean;
};
