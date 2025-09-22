import { calculateMultiplier } from "../utils";
import { CardTargetType } from "../card-target";
import { CardInfo } from "shared/types/battle/cards";

export const tripleAttack: CardInfo = {
	displayName: "Triple Swipe",
	manaCost: 25,
	base: 80,
	priority: 10,
	cardTarget: CardTargetType.AllEnemyTeam,
	getDesc(quality) {
		const calculated = calculateMultiplier(this.base, quality);
		return `Attacks an enemy 3 times, dealing ${calculated}% of attack as damage. The last attack also damages all targets.`;
	},
};
