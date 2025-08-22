import { CardName } from "./card-names";
import { fireballCard } from "./card-info/card-fireball";
import { lightningStormCard } from "./card-info/card-lightning-storm";

export interface CardData {
    displayName: string;
    manaCost: number;
    getDesc: (multiplier: number) => string;
}

export const cards: Record<CardName, CardData>  = {
    fireball: fireballCard,
    lightningStorm: lightningStormCard
}

