import { calculateMultiplier } from "../utils";
import { CardInfo } from "../types";
import { CardTargetType } from "../target-type";

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
