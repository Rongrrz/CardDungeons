import { Client, createRemotes, remote, Server } from "@rbxts/remo";
import { t } from "@rbxts/t";
import { cardCodenames, CardName } from "shared/data/cards/codenames";
import { BattleClient, CardInput, OnUseReplicationInfo } from "shared/types/battle";
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
	SendReadyForPlayerInput: remote<Client, [Array<Card>]>(t.array(isCardCheck)),

	// TODO: This is the same as the validator in collect-player-responses provided by battle
	// TODO: Use Flamework here
	ReceivePlayerInput: remote<Server, [CardInput]>(
		t.union(
			t.strictInterface({
				kind: t.literal("PlayCard"),
				cardUsed: isCardCheck,
				targetSlot: t.number,
			}),
			t.strictInterface({
				kind: t.literal("EndTurn"),
			}),
		),
	),

	// Replication
	ReplicateCardOnUse: remote<Client, [CardName, number, OnUseReplicationInfo]>(),
	ReplicateCardOnUseFinished: remote<Server, []>(),
});
