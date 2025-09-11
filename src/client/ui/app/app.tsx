import React from "@rbxts/react";
import { CardContainer } from "client/ui/app/battle-card";
import { ToastViewport } from "client/ui/app/toast";
import { TargetSelection } from "./battle-select-target/battle-select.target";

export function App() {
	return (
		<>
			<CardContainer />
			<ToastViewport />
			<TargetSelection />
		</>
	);
}
