import { CardTargetType } from "../target-type";
import { CardInfo } from "../types";

export const empty: CardInfo = {
	displayName: "Empty",
	manaCost: 5,
	base: 0,
	getDesc() {
		return `A card to clog up your hand... :)`;
	},
	targetType: CardTargetType.None,
};
