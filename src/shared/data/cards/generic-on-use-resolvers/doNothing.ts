import { OnUseResolver } from "shared/types/battle/cards";

export const resolveDoNothing: OnUseResolver = (card) => {
	warn(`Do nothing initiated, did we forget to implement something?`);
	return [];
};
