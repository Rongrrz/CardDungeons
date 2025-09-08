import { calculateMultiplier } from "../utils";
import { CardTargetType } from "../target-type";
import { CardInfo } from "shared/types/cards";

export const fireball: CardInfo = {
	displayName: "Fireball",
	manaCost: 15,
	base: 180,
	getDesc(quality) {
		const calculated = calculateMultiplier(this.base, quality);
		return `Cast a fireball spell towards a single-target, dealing ${calculated}% of attack as damage.`;
	},
	targetType: CardTargetType.SingleEnemy,
};
