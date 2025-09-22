import { produce } from "@rbxts/immut";
import { CardController } from "./controllers/card-controller";
import { MoveController } from "./controllers/move-controller";
import { BaseStats, BattleStats } from "shared/types/battle/shared";
import { CombatantClient } from "shared/types/battle/battle";

type AnyController = CardController | MoveController;
export type AllyCombatant = Combatant<false>;
export type EnemyCombatant = Combatant<true>;
export type PlayerCombatant = AllyCombatant & { controller: CardController };

export class Combatant<
	IsEnemy extends boolean = boolean,
	Controller extends AnyController = AnyController,
> {
	public readonly entity: string;
	private stats: BattleStats;
	public isAlive: boolean;
	public controller: Controller;
	public readonly isEnemy: IsEnemy;
	public readonly slot: number;

	public constructor(
		entity: string,
		isEnemy: IsEnemy,
		slot: number,
		stats: BaseStats,
		controller: Controller,
	) {
		this.stats = produce(stats, (draft) => {
			draft.hp = draft.hp ?? draft.maxHp;
		}) as BattleStats;

		this.isEnemy = isEnemy ?? false;
		this.isAlive = this.stats.hp > 0;
		this.controller = controller;
		this.slot = slot;
		this.entity = "BlueSlime"; // TODO: Change later
	}

	// TODO: Could look prettier
	public toClientRepresentation(): CombatantClient {
		const shared = {
			stats: this.stats,
			entity: this.entity,
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
		return shared;
	}

	public getStats(): Readonly<BattleStats> {
		return this.stats;
	}

	/**
	 * @returns the actual amount of HP taken after other considerations
	 */
	public takeDamage(amount: number, attacker: Combatant): number {
		if (this.isAlive === false) return 0;
		const startingHp = this.stats.hp;
		this.stats.hp = math.max(this.stats.hp - amount, 0);
		return startingHp - this.stats.hp;
	}

	/**
	 * @returns the actual amount of HP healed after other considerations
	 */
	public heal(amount: number): number {
		if (this.isAlive === false) return 0;
		const startingHp = this.stats.hp;
		this.stats.hp = math.min(this.stats.hp + amount, this.stats.maxHp);
		return this.stats.hp - startingHp;
	}
}

export function isPlayerCombatant(c: Combatant): c is PlayerCombatant {
	return c.controller instanceof CardController;
}

export function isOwnerByPlayer(c: Combatant, player: Player): c is PlayerCombatant {
	return isPlayerCombatant(c) && c.controller.owner === player;
}
