import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { CardViewport } from "client/ui/app/battle-card";
import { ToastViewport } from "client/ui/app/toast";
import { toastAtom } from "client/atoms/toast";
import { cardContainerCards, cardTargets, isCardContainerIn } from "client/atoms/battle-inputting";
import { TargetSelection } from "./battle-select-target/battle-select.target";

export function App() {
	const toastViewportItems = useAtom(toastAtom);
	const cardViewportItems = useAtom(cardContainerCards);
	const cardTargetsItems = useAtom(cardTargets);

	const isInputting = useAtom(isCardContainerIn);

	return (
		<>
			<CardViewport cards={cardViewportItems} in={isInputting} />
			<ToastViewport toasts={toastViewportItems} />
			<TargetSelection targets={cardTargetsItems} />
		</>
	);
}
