import { calculateMultiplier } from "../utils";
import { ServerCard } from "../types";

export const lightningStorm: ServerCard = {
	displayName: "Lightning Storm",
	manaCost: 30,
	base: 200,
	getDesc(quality) {
		const calculated = calculateMultiplier(this.base, quality);
		return `Summon a lightning storm, dealing ${calculated}% of attack as damage to a all enemies.`;
	},
};
