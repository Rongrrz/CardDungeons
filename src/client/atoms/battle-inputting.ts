import { atom } from "@rbxts/charm";
import { Selected } from "client/constants/selected";
import { Card } from "shared/types/cards";

// For whenever the player is inputting, this is if the card container should be in or not.
export const isCardContainerIn = atom<boolean>(false);

export const selectedCardSlotAtom = atom<number>(undefined);

export const playerHand = atom<Card[]>([]);

// For whenever the player is selecting a target with a designated card.
export type CardTarget = {
	model: Model;
	slot: number;
	selected: Selected;
};
export const cardTargets = atom<Array<CardTarget>>([]);
