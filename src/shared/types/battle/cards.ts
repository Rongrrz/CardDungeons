import { CardName } from "shared/data/cards/codenames";
import { CardTargetType } from "shared/data/cards/card-target";
import { ICombatant, OnUseReplicationInfo } from "./shared";

export type OnUseResolver = (
	card: CardInfo,
	quality: number,
	user: ICombatant,
	targets: ICombatant[],
) => OnUseReplicationInfo;

export type CardInfo = {
	displayName: string;
	manaCost: number;
	base: number;
	priority: number; // 0-20
	cardTarget: CardTargetType;
	getDesc(quality: number): string;
	onUse: OnUseResolver;
};

export type Card = {
	card: CardName;
	quality: number;
};
