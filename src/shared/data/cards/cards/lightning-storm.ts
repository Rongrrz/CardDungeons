import { calculateMultiplier } from "../utils";
import { CardTargetType } from "../card-target";
import { CardInfo } from "shared/types/cards";
import { CardRoleType } from "../card-role";

export const lightningStorm: CardInfo = {
	displayName: "Lightning Storm",
	manaCost: 30,
	base: 200,
	priority: 10,
	getDesc(quality) {
		const calculated = calculateMultiplier(this.base, quality);
		return `Summon a lightning storm, dealing ${calculated}% of attack as damage to a all enemies.`;
	},
	cardTarget: CardTargetType.AllEnemyTeam,
	cardRole: CardRoleType.Attack,
};
