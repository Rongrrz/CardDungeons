import { ArrayUtilities, Object } from "@rbxts/luau-polyfill";
import { Players } from "@rbxts/services";
import { PlayerIdMapOrArray, PlayerOrId } from "shared/types/player";

export function getPlayerByUserId(playerOrId: PlayerOrId): Player | undefined {
	return typeIs(playerOrId, "number") ? Players.GetPlayerByUserId(playerOrId) : playerOrId;
}

export function getPlayers(players: PlayerIdMapOrArray): Array<Player> {
	const keys = ArrayUtilities.isArray(players) ? players : Object.keys(players);
	return keys.map((k) => getPlayerByUserId(k)).filterUndefined();
}
