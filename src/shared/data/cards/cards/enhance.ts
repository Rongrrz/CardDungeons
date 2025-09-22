import { CardInfo } from "shared/types/battle/cards";
import { CardTargetType } from "../card-target";

export const enhance: CardInfo = {
	displayName: "Enhance",
	manaCost: 40,
	base: 0,
	priority: 15,
	cardTarget: CardTargetType.User,
	getDesc() {
		return `Gain 2 stacks of "Enhancement"`;
	},
};
