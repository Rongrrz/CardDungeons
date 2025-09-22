import { atom } from "@rbxts/charm";
import { Selected } from "client/constants/selected";
import { Card } from "shared/types/battle/cards";

// For whenever the player is inputting, this is if the card container should be in or not.
export const isCardTrayOpenAtom = atom<boolean>(false);

export const selectedHandIndexAtom = atom<number>(undefined);

export const cardInHandAtom = atom<Array<Card>>([]);

export type TargetedCombatants = {
	selected: Selected;
	slot: number;
	isEnemy: boolean;
};
export const targetMarksAtom = atom<Array<TargetedCombatants>>([]);

export type CombatantModel = {
	model: Model;
	slot: number;
	isEnemy: boolean;
	maxhp: number;
	hp: number;
	ownerUserId?: number;
};
export const fieldCombatantsAtom = atom<Array<CombatantModel>>([]);
