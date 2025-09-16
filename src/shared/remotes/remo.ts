import { Client, createRemotes, remote, Server } from "@rbxts/remo";
import { t } from "@rbxts/t";
import { cardCodenames } from "shared/data/cards/codenames";
import { BattleClient } from "shared/types/battle";
import { Card } from "shared/types/cards";

export const isCardCheck = t.strictInterface({
	card: t.literalList([...cardCodenames]),
	quality: t.numberConstrained(80, 100),
});

export const remotes = createRemotes({
	// Battle snapshots
	SendBattleSnapshot: remote<Client, [BattleClient]>(),
	ReceiveBattleInitialized: remote<Server, []>(),

	// Player inputs
	SendReadyForPlayerInput: remote<Client, [hand: Array<Card>]>(t.array(isCardCheck)),
	ReceivePlayerInput: remote<Server, [cardUsed: Card, targetSlot: number]>(isCardCheck, t.number),
});
