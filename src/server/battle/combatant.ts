import { produce } from "@rbxts/immut";
import { CardController, isCardController } from "./controllers/card-controller";
import { MoveController } from "./controllers/move-controller";
import { ReplicatedStorage } from "@rbxts/services";
import { BaseStats, BattleStats, CombatantClient } from "shared/types/battle-oop";

export type PlayerCombatant = Combatant & {
	controller: CardController;
};

export class Combatant {
	public readonly model: Model;
	private stats: BattleStats;
	public isAlive: boolean;
	public controller: CardController | MoveController;
	public readonly slot: number;

	constructor(slot: number, stats: BaseStats, controller: CardController | MoveController) {
		this.stats = produce(stats, (draft) => {
			draft.hp = draft.hp ?? draft.maxHp;
		}) as BattleStats;

		this.isAlive = this.stats.hp > 0;
		this.controller = controller;
		this.slot = slot;
		this.model = ReplicatedStorage.Models.BlueSlime;
	}

	public toClientRepresentation(): CombatantClient {
		const hand = isCardController(this.controller) ? this.controller.getHand() : undefined;
		return {
			// Investigate why i dont fully need owneruserid
			stats: this.stats,
			hand: hand,
		};
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
