import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { CardViewport } from "client/ui/app/battle-card";
import { ToastViewport } from "client/ui/app/toast";
import { cardAtom } from "client/atoms/battle-cards";
import { toastAtom } from "client/atoms/toast";

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
