import { CardInfo } from "shared/types/cards";
import { CardTargetType } from "../card-target";
import { resolveDoNothing } from "../generic-on-use-resolvers/doNothing";

export const enhance: CardInfo = {
	displayName: "Enhance",
	manaCost: 40,
	base: 0,
	priority: 15,
	cardTarget: CardTargetType.User,
	getDesc() {
		return `Gain 2 stacks of "Enhancement"`;
	},
	onUse: resolveDoNothing,
};
