import { CardTargetType } from "../target-type";
import { CardInfo } from "../types";

export const enhance: CardInfo = {
	displayName: "Enhance",
	manaCost: 40,
	base: 0,
	getDesc() {
		return `Gain 2 stacks of "Enhancement"`;
	},
	targetType: CardTargetType.User,
};
