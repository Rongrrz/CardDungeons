import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { ToastViewport } from "client/components/toast";
import { toastAtom } from "client/stores/toast";

export function App() {
	const toastViewportItems = useAtom(toastAtom);

	return <ToastViewport toasts={toastViewportItems} />;
}
