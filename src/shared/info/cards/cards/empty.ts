import { ServerCard } from "../types";

export const empty: ServerCard = {
	displayName: "Empty",
	manaCost: 5,
	base: 0,
	getDesc() {
		return `A card to clog up your hand... :)`;
	},
};
