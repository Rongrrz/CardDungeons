import { calculateMultiplier } from "../utils";
import { CardTargetType } from "../card-target";
import { CardInfo } from "shared/types/battle/cards";
import { resolveDamageOnce } from "../generic-on-use-resolvers/damageOnce";

export const fireball: CardInfo = {
	displayName: "Fireball",
	manaCost: 15,
	base: 180,
	priority: 10,
	cardTarget: CardTargetType.SingleEnemy,
	getDesc(quality) {
		const calculated = calculateMultiplier(this.base, quality);
		return `Cast a fireball spell towards a single-target, dealing ${calculated}% of attack as damage.`;
	},
	onUse: resolveDamageOnce,
};
