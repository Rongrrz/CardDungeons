import { CardName } from "shared/data/cards/codenames";
import { OnUseResolver } from "../types";
import { resolveDoNothing } from "./doNothing";
import { resolveDamageOnce } from "./damageOnce";
import { resolveTripleAttack } from "./tripleAttack";

export const CARD_RESOLVERS = {
	fireball: resolveDamageOnce,
	lightningStorm: resolveDamageOnce,
	enhance: resolveDoNothing,
	tripleAttack: resolveTripleAttack,
} satisfies Record<CardName, OnUseResolver>;
