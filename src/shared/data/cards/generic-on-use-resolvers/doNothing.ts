import { EffectResolver } from "shared/types/battle";

export const resolveDoNothing: EffectResolver = () =>
	warn(`Do nothing initiated, did we forget to implement something?`);
