import { atom } from "@rbxts/charm";
import { Selected } from "client/constants/selected";

export const inputtingAtom = atom<boolean>(false);

export type CardTarget = {
	model: Model;
	selected: Selected;
};
export const cardTargetsAtom = atom<Array<CardTarget>>([]);
