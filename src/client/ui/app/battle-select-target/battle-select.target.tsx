import React from "@rbxts/react";
import { TargetCrosshair } from "./crosshair";
import { CardTarget } from "client/atoms/battle-inputting";

type TargetSelectionProps = {
	targets: Array<CardTarget>;
};

export function TargetSelection(props: TargetSelectionProps) {
	return (
		<>
			{props.targets.map((target, index) => {
				return (
					<TargetCrosshair
						key={`${index}`}
						target={target.model}
						selected={target.selected}
					/>
				);
			})}
		</>
	);
}
