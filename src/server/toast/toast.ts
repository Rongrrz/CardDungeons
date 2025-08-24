import { Players, ReplicatedStorage } from "@rbxts/services";
import { ToastRequest } from "shared/types/toast";

const SendToast = ReplicatedStorage.Remotes.SendToastMessage;

export function toastPlayer(player: Player, toast: ToastRequest): void {
	SendToast.FireClient(player, toast);
}

export function toastAllPlayers(message: string): void;
export function toastAllPlayers(request: ToastRequest): void;
export function toastAllPlayers(toast: ToastRequest | string): void {
	const toastRequest: ToastRequest = typeIs(toast, "string")
		? { message: toast, color: "Orange" } // TODO: Add default color
		: toast;

	for (const player of Players.GetPlayers()) {
		toastPlayer(player, toastRequest);
	}
}
