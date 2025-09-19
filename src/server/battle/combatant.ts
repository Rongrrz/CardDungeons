import { produce } from "@rbxts/immut";
import { CardController } from "./controllers/card-controller";
import { MoveController } from "./controllers/move-controller";
import {
	BaseStats,
	BattleStats,
	CombatantClient,
	CombatantClientShared,
	ICombatant,
} from "shared/types/battle";
import { ModelName } from "shared/types/utils";

export type PlayerCombatant = Combatant & {
	controller: CardController;
};

export class Combatant implements ICombatant {
	public readonly model: ModelName;
	private stats: BattleStats;
	public isAlive: boolean;
	public controller: CardController | MoveController;
	public readonly isEnemy: boolean;
	public readonly slot: number;

	constructor(
		slot: number,
		stats: BaseStats,
		controller: CardController | MoveController,
		isEnemy?: boolean,
	) {
		this.stats = produce(stats, (draft) => {
			draft.hp = draft.hp ?? draft.maxHp;
		}) as BattleStats;

		this.isEnemy = isEnemy ?? false;
		this.isAlive = this.stats.hp > 0;
		this.controller = controller;
		this.slot = slot;
		this.model = "BlueSlime"; // TODO: Make this dynamic
	}

	// TODO: Could look prettier
	public toClientRepresentation(): CombatantClient {
		const shared: CombatantClientShared = {
			stats: this.stats,
			model: this.model,
			slot: this.slot,
			isEnemy: this.isEnemy,
		};
		if (isPlayerCombatant(this)) {
			return {
				...shared,
				hand: this.controller.getHand(),
				ownerUserId: this.controller.owner.UserId,
			};
		}
		return { ...shared };
	}

	// Returns the actual amount of damage taken
	public takeDamage(multiplier: number, attacker: Combatant): number {
		// TODO: Extract damage into a damage-calculation formula/function
		const damage = math.floor(
			math.max(1, multiplier * (attacker.stats.attack - this.stats.defense)),
		);
		this.stats.hp -= damage;
		return damage;
	}

	// Returns the actual amount healed
	public heal(amount: number): number {
		if (!this.isAlive) return 0;
		const amountHealed = math.min(this.stats.hp + amount, this.stats.maxHp);
		this.stats.hp += amountHealed;
		return amountHealed;
	}
}

export function isPlayerCombatant(c: Combatant): c is PlayerCombatant {
	return c.controller instanceof CardController;
}

export function isOwnerByPlayer(c: Combatant, player: Player): c is PlayerCombatant {
	return isPlayerCombatant(c) && c.controller.owner === player;
}
