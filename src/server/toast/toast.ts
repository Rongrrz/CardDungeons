import { ArrayUtilities, Object } from "@rbxts/luau-polyfill";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { ToastRequest } from "shared/types/toast";
import { getPlayerByUserId, PlayerOrIdGroup, PlayerOrId } from "shared/utils/player-or-id";

const SendToast = ReplicatedStorage.Remotes.SendToastMessage;

type ToastInput = ToastRequest | string;
export function toastPlayer(playerOrId: PlayerOrId, toast: ToastInput): void {
	const toastRequest: ToastRequest = typeIs(toast, "string")
		? { message: toast, color: "Orange" } // TODO: Add default color
		: toast;

	const player = getPlayerByUserId(playerOrId);

	if (player === undefined) {
		print(`Toast: Attempted to toast a nonexistent player. UserId ${playerOrId}`);
		return;
	}

	SendToast.FireClient(player, toastRequest);
}

export function toastPlayers(playerIdMap: Map<PlayerOrId, unknown>, toast: ToastInput): void;
export function toastPlayers(playersOrIds: Array<PlayerOrId>, toast: ToastInput): void;
export function toastPlayers(players: PlayerOrIdGroup, toast: ToastInput): void {
	const keys = ArrayUtilities.isArray(players) ? players : Object.keys(players);
	for (const playerOrId of keys) toastPlayer(playerOrId, toast);
}

export function toastAllPlayers(toast: ToastInput): void {
	toastPlayers(Players.GetPlayers(), toast);
}
