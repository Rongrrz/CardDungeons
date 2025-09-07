import { Client, createRemotes, remote, Server } from "@rbxts/remo";
import { t } from "@rbxts/t";
import { cardCodenames } from "shared/data/cards/codenames";
import { BattleClient } from "shared/types/battle";
import { Card } from "shared/types/cards";

export const remotes = createRemotes({
	// Battle snapshots
	SendBattleSnapshot: remote<Client, [BattleClient]>(),
	ReceiveBattleInitialized: remote<Server, []>(),

	// Player inputs
	SendReadyForPlayerInput: remote<Client, [hand: Array<Card>]>(
		t.array(
			t.strictInterface({
				card: t.literalList([...cardCodenames]),
				quality: t.numberConstrained(80, 100),
			}),
		),
	),
	ReceivePlayerInput: remote<Server, []>(),
});
