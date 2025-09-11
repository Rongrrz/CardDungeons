import { CardName } from "shared/data/cards/codenames";
import { CardTargetType } from "shared/data/cards/target-type";

export type CardInfo = {
	displayName: string;
	manaCost: number;
	base: number;
	targetType: CardTargetType;
	getDesc(quality: number): string;
};

export type Card = {
	card: CardName;
	quality: number;
};
