import { CardName } from "shared/data/cards/codenames";
import { CardTargetType } from "shared/data/cards/card-target";
import { EffectResolver } from "./battle";

export type CardInfo = {
	displayName: string;
	manaCost: number;
	base: number;
	priority: number; // 0-20
	cardTarget: CardTargetType;
	getDesc(quality: number): string;
	onUse: EffectResolver;
};

export type Card = {
	card: CardName;
	quality: number;
};
