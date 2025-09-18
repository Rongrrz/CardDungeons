import { calculateMultiplier } from "../utils";
import { CardTargetType } from "../card-target";
import { CardInfo } from "shared/types/cards";
import { resolveDamageOnce } from "../generic-on-use-resolvers/damageOnce";

export const lightningStorm: CardInfo = {
	displayName: "Lightning Storm",
	manaCost: 30,
	base: 200,
	priority: 10,
	cardTarget: CardTargetType.AllEnemyTeam,
	getDesc(quality) {
		const calculated = calculateMultiplier(this.base, quality);
		return `Summon a lightning storm, dealing ${calculated}% of attack as damage to a all enemies.`;
	},
	onUse: resolveDamageOnce,
};
