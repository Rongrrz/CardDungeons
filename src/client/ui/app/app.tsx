import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { CardViewport } from "client/ui/app/battle-card";
import { ToastViewport } from "client/ui/app/toast";
import { cardAtom } from "client/atoms/battle-cards";
import { toastAtom } from "client/atoms/toast";
import { cardTargetsAtom, inputtingAtom } from "client/atoms/battle-inputting";
import { TargetSelection } from "./battle-select-target/battle-select.target";

export function App() {
	const toastViewportItems = useAtom(toastAtom);
	const cardViewportItems = useAtom(cardAtom);
	const cardTargetsItems = useAtom(cardTargetsAtom);

	const isInputting = useAtom(inputtingAtom);

	return (
		<>
			<CardViewport cards={cardViewportItems} in={isInputting} />
			<ToastViewport toasts={toastViewportItems} />
			<TargetSelection targets={cardTargetsItems} />
		</>
	);
}
