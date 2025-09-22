import React from "@rbxts/react";
import { CardContainer } from "client/ui/app/battle/card-interface";
import { ToastViewport } from "client/ui/app/toast";
import { TargetSelection } from "./battle/target-selection";
import { StatusBars } from "./battle/status-bar";

export function App() {
	return (
		<>
			<CardContainer />
			<ToastViewport />
			<TargetSelection />
			<StatusBars />
		</>
	);
}
