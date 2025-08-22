import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { ToastViewport } from "client/components/toast-notification/toast-viewport";
import { toastAtom } from "client/stores/toast";

export function App() {
	const toastViewportItems = useAtom(toastAtom);

	return <ToastViewport toasts={toastViewportItems} />;
}
