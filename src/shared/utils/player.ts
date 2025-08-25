import { Players } from "@rbxts/services";
import { PlayerOrId } from "shared/types/player";

export function getPlayerByUserId(playerOrId: number): Player | undefined;
export function getPlayerByUserId(playerOrId: Player): Player;
export function getPlayerByUserId(playerOrId: PlayerOrId): Player | undefined;
export function getPlayerByUserId(playerOrId: PlayerOrId): Player | undefined {
	return typeIs(playerOrId, "number") ? Players.GetPlayerByUserId(playerOrId) : playerOrId;
}
