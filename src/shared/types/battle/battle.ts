import { damageNumber } from "../damage-number";
import { StrictUnion } from "../general";
import { Card } from "./cards";
import { CombatantClientShared } from "./shared";

export type CombatantClient = StrictUnion<CombatantClientEntity, CombatantClientPlayer>;

type CombatantClientPlayer = CombatantClientShared & {
	ownerUserId: number;
	hand: Array<Card>;
};
export type CombatantClientEntity = CombatantClientShared & {};

export type BattleClient = {
	turn: number;
	combatants: Array<CombatantClient>;
};

// Inputs/actions
export type PlayCard = {
	kind: "PlayCard";
	cardUsed: Card;
	targetSlot: number;
};

type EndTurn = { kind: "EndTurn" };

export type PlayCardInput = {
	player: Player;
	action: Omit<PlayCard, "kind">;
};

export type CardInput = StrictUnion<PlayCard, EndTurn>;

export type OnUseReplicationInfo = {
	slot: number;
	isEnemy: boolean;
	numbers?: Array<{
		number: number;
		damageType: damageNumber;
	}>;
	finalHp: number;
	finalMaxHp: number;
}[];
