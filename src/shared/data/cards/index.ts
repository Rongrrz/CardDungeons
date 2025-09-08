import { CardName } from "./codenames";
import { fireball } from "./cards/fireball";
import { lightningStorm } from "./cards/lightning-storm";
import { empty } from "./cards/empty";
import { enhance } from "./cards/enhance";
import { CardInfo } from "shared/types/cards";

export const cards = {
	fireball,
	lightningStorm,
	empty,
	enhance,
} satisfies Record<CardName, CardInfo>;
