import { atom } from "@rbxts/charm";
import { ReplicatedStorage } from "@rbxts/services";
import { ServerToast, ClientToast } from "shared/types/toast";
import { TOAST_TIME } from "shared/utils/constants";

//export const toastAtom = atom<Array<ClientToast>>([]);
export const toastAtom = atom<Set<ClientToast>>(new Set());
let id = 0;

function onToast(toast: ServerToast) {
	const newToastMessage: ClientToast = {
		...toast,
		id: id++,
	};

	toastAtom((current) => current.add(newToastMessage));

	task.delay(TOAST_TIME, () => {
		toastAtom((current) => {
			current.delete(newToastMessage);
			return current;
		});
	});
}

ReplicatedStorage.Remotes.SendNotification.OnClientEvent.Connect(onToast);
