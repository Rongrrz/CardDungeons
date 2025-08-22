import { Players, ReplicatedStorage } from "@rbxts/services";
import { ServerToast } from "shared/types/toast";

const SendNotification = ReplicatedStorage.Remotes.SendNotification;

export function notifyPlayer(player: Player, toast: ServerToast) {
	SendNotification.FireClient(player, toast);
}

export function notifyAll(toast: ServerToast) {
	for (const player of Players.GetPlayers()) {
		notifyPlayer(player, toast);
	}
}
