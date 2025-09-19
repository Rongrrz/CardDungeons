import { CardName } from "shared/data/cards/codenames";
import { Card, CardInfo } from "./cards";
import { ModelName, StrictUnion } from "./utils";

export type BaseStats = {
	maxHp: number;
	hp?: number;
	attack: number;
	defense: number;
	speed: number;
};

export type BattleStats = Omit<BaseStats, "hp"> & { hp: number };

export type CombatantClientShared = {
	stats: BattleStats;
	model: ModelName;
	slot: number;
	isEnemy: boolean;
};

type CombatantClientEntity = CombatantClientShared & {};

type CombatantClientPlayer = CombatantClientShared & {
	hand: Array<Card>;
	ownerUserId: number;
};

export type CombatantClient = StrictUnion<CombatantClientEntity, CombatantClientPlayer>;

export type BattleClient = {
	turn: number;
	combatants: Array<CombatantClient>;
};

export type PlayCard = {
	kind: "PlayCard";
	cardUsed: Card;
	targetSlot: number;
};

type EndTurn = {
	kind: "EndTurn";
};

export type PlayCardInput = {
	player: Player;
	action: Omit<PlayCard, "kind">;
};

export type CardInput = StrictUnion<PlayCard, EndTurn>;

export type ICombatant = {
	isEnemy: boolean;
	slot: number;
	takeDamage(multiplier: number, attacker: ICombatant): number;
};

export type OnUseReplicationInfo = {
	slot: number;
	isEnemy: boolean;
	numbers?: Array<{
		damage: number;
		crit: boolean;
	}>;
}[];

export type OnUseResolver = (
	card: CardInfo,
	quality: number,
	user: ICombatant,
	targets: ICombatant[],
) => OnUseReplicationInfo;
