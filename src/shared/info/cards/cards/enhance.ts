import { ServerCard } from "../types";

export const enhance: ServerCard = {
	displayName: "Empty",
	manaCost: 40,
	base: 0,
	getDesc() {
		return `Gain 2 stacks of "Enhancement"`;
	},
};
