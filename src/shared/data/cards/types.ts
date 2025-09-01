import { CardName } from "./codenames";
import { CardTargetType } from "./target-type";

export type CardInfo = {
	displayName: string;
	manaCost: number;
	base: number;
	targetType: CardTargetType;
	getDesc(quality: number): string;
};

export type ClientCard = {
	card: CardName;
	quality: number; // 80-100
};
