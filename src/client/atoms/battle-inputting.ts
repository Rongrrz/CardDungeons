import { atom } from "@rbxts/charm";
import { Selected } from "client/constants/selected";
import { ClientCard } from "shared/data/cards/types";

// For whenever the player is inputting, this is if the card container should be in or not.
export const isCardContainerIn = atom<boolean>(false);

// For whenever the player is inputting, these are the cards they can use.
export const cardContainerCards = atom<Array<ClientCard>>([]);

export const selectedCardSlotAtom = atom<number>(undefined);

// For whenever the player is selecting a target with a designated card.
export type CardTarget = {
	model: Model;
	slot?: number;
	selected: Selected;
};
export const cardTargets = atom<Array<CardTarget>>([]);
