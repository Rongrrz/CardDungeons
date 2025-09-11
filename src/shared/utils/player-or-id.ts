import { ArrayUtilities, Object } from "@rbxts/luau-polyfill";
import { Players } from "@rbxts/services";

export type PlayerOrIdGroup = Map<PlayerOrId, unknown> | Array<PlayerOrId>;
export type PlayerOrId = Player | number;

export function getPlayerByUserId(playerOrId: PlayerOrId): Player | undefined {
	return typeIs(playerOrId, "number") ? Players.GetPlayerByUserId(playerOrId) : playerOrId;
}

export function getPlayers(players: PlayerOrIdGroup): Array<Player> {
	const keys = ArrayUtilities.isArray(players) ? players : Object.keys(players);
	return keys.map((k) => getPlayerByUserId(k)).filterUndefined();
}
