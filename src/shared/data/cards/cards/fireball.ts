import { calculateMultiplier } from "../utils";
import { CardTargetType } from "../card-target";
import { CardInfo } from "shared/types/cards";
import { CardRoleType } from "../card-role";

export const fireball: CardInfo = {
	displayName: "Fireball",
	manaCost: 15,
	base: 180,
	priority: 10,
	getDesc(quality) {
		const calculated = calculateMultiplier(this.base, quality);
		return `Cast a fireball spell towards a single-target, dealing ${calculated}% of attack as damage.`;
	},
	cardTarget: CardTargetType.SingleEnemy,
	cardRole: CardRoleType.Attack,
};
