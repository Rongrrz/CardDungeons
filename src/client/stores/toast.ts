import { atom } from "@rbxts/charm";
import { ReplicatedStorage } from "@rbxts/services";
import { ToastRequest, ToastEntry } from "shared/types/toast";
import { TOAST_TIME } from "shared/utils/constants";

export const toastAtom = atom<Array<ToastEntry>>([]);
let id = 0;

export function newToast(toast: ToastRequest) {
	const newEntry: ToastEntry = {
		...toast,
		id: id++,
	};

	toastAtom((current) => [...current, newEntry]);

	task.delay(TOAST_TIME, () => {
		toastAtom((current) => current.filter((t) => t.id !== newEntry.id));
	});
}

ReplicatedStorage.Remotes.SendToastMessage.OnClientEvent.Connect(newToast);
