import { atom } from "@rbxts/charm";
import { Selected } from "client/constants/selected";
import { ClientCard } from "shared/data/cards/types";

// For whenever the player is inputting, this is if the card container should be in or not.
export const inputtingAtom = atom<boolean>(false);

// For whenever the player is inputting, these are the cards they can use.
export const cardAtom = atom<Array<ClientCard>>([]);

// For whenever the player is selecting a target with a designated card.
export type CardTarget = {
	model: Model;
	selected: Selected;
};
export const cardTargetsAtom = atom<Array<CardTarget>>([]);
