import { CardInfo } from "shared/types/cards";
import { CardTargetType } from "../card-target";
import { CardRoleType } from "../card-role";

export const enhance: CardInfo = {
	displayName: "Enhance",
	manaCost: 40,
	base: 0,
	priority: 15,
	getDesc() {
		return `Gain 2 stacks of "Enhancement"`;
	},
	cardTarget: CardTargetType.User,
	cardRole: CardRoleType.Support,
};
