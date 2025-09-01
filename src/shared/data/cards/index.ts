import { CardName } from "./codenames";
import { fireball } from "./cards/fireball";
import { lightningStorm } from "./cards/lightning-storm";
import { CardInfo } from "./types";
import { empty } from "./cards/empty";
import { enhance } from "./cards/enhance";

export const cards = {
	fireball,
	lightningStorm,
	empty,
	enhance,
} satisfies Record<CardName, CardInfo>;
