import { calculateMultiplier } from "../utils";
import { CardTargetType } from "../target-type";
import { CardInfo } from "shared/types/cards";

export const lightningStorm: CardInfo = {
	displayName: "Lightning Storm",
	manaCost: 30,
	base: 200,
	getDesc(quality) {
		const calculated = calculateMultiplier(this.base, quality);
		return `Summon a lightning storm, dealing ${calculated}% of attack as damage to a all enemies.`;
	},
	targetType: CardTargetType.AllEnemyTeam,
};
