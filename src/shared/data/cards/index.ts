import { CardName } from "./codenames";
import { fireball } from "./cards/fireball";
import { lightningStorm } from "./cards/lightning-storm";
import { enhance } from "./cards/enhance";
import { CardInfo } from "shared/types/battle/cards";
import { tripleAttack } from "./cards/tripleAttack";

export const cards = {
	fireball,
	lightningStorm,
	enhance,
	tripleAttack,
} satisfies Record<CardName, CardInfo>;
