import { Players, ReplicatedStorage } from "@rbxts/services";
import { PlayerOrId } from "shared/types/player";
import { ToastRequest } from "shared/types/toast";
import { getPlayerByUserId } from "shared/utils/player";

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

export function toastPlayers(playersOrIds: Array<PlayerOrId>, toast: ToastInput): void {
	for (const playerOrId of playersOrIds) toastPlayer(playerOrId, toast);
}

export function toastAllPlayers(toast: ToastInput): void {
	toastPlayers(Players.GetPlayers(), toast);
}
