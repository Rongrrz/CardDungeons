import { CardController, MoveController } from "./controller";

type BaseStats = {
	maxHp: number;
	hp?: number;
	attack: number;
	defense: number;
	speed: number;
};

type BattleStats = Omit<BaseStats, "hp"> & {
	hp: number;
};

export class Combatant {
	private stats: BattleStats;
	public isAlive: boolean;
	public controller: CardController | MoveController;
	public readonly slot: number;

	constructor(slot: number, stats: BaseStats, controller: CardController | MoveController) {
		this.stats = { ...stats, hp: stats.hp ?? stats.maxHp };
		this.isAlive = this.stats.hp > 0;
		this.controller = controller;
		this.slot = slot;
	}

	// Returns the actual amount of damage taken
	public takeDamage(percentage: number, attacker: Combatant): number {
		this.stats.hp -= 10;
		return 10;
	}

	// Returns the actual amount healed
	public heal(amount: number): number {
		if (!this.isAlive) return 0;
		const amountHealed = math.min(this.stats.hp + amount, this.stats.maxHp);
		this.stats.hp += amountHealed;
		return amountHealed;
	}
}

export type PlayerCombatant = Combatant & {
	controller: CardController;
};
