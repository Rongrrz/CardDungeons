import { OnUseResolver } from "../types";

export const resolveDoNothing: OnUseResolver = () => {
	warn(`Do nothing initiated, did we forget to implement something?`);
	return [];
};
