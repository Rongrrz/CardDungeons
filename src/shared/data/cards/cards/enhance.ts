import { CardInfo } from "shared/types/cards";
import { CardTargetType } from "../target-type";

export const enhance: CardInfo = {
	displayName: "Enhance",
	manaCost: 40,
	base: 0,
	getDesc() {
		return `Gain 2 stacks of "Enhancement"`;
	},
	targetType: CardTargetType.User,
};
