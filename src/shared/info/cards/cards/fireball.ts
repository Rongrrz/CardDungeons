import { calculateMultiplier } from "../utils";
import { ServerCard } from "../types";

export const fireball: ServerCard = {
	displayName: "Fireball",
	manaCost: 15,
	base: 180,
	getDesc(quality) {
		const calculated = calculateMultiplier(this.base, quality);
		return `Cast a fireball spell towards a single-target, dealing ${calculated}% of attack as damage.`;
	},
};
