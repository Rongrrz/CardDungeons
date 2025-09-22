import { CardName } from "shared/data/cards/codenames";
import { CardTargetType } from "shared/data/cards/card-target";

export type CardInfo = {
	displayName: string;
	manaCost: number;
	base: number;
	priority: number; // 0-20
	cardTarget: CardTargetType;
	getDesc(quality: number): string;
};

export type Card = {
	card: CardName;
	quality: number;
};
