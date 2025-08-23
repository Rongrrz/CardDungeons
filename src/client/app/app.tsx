import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { CardViewport } from "client/components/battle-card";
import { ToastViewport } from "client/components/toast";
import { cardAtom } from "client/stores/battle-card";
import { toastAtom } from "client/stores/toast";

export function App() {
	const toastViewportItems = useAtom(toastAtom);
	const cardViewportItems = useAtom(cardAtom);

	return (
		<>
			<CardViewport cards={cardViewportItems} />
			<ToastViewport toasts={toastViewportItems} />
		</>
	);
}
