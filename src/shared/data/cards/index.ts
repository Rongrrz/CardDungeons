import { CardName } from "./codenames";
import { fireball } from "./cards/fireball";
import { lightningStorm } from "./cards/lightning-storm";
import { ServerCard } from "./types";
import { empty } from "./cards/empty";
import { enhance } from "./cards/enhance";

export const cards: Record<CardName, ServerCard> = {
	fireball: fireball,
	lightningStorm: lightningStorm,
	empty: empty,
	enhance: enhance,
};
