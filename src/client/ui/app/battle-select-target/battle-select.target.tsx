import React from "@rbxts/react";
import { TargetCrosshair } from "./crosshair";
import { CardTarget } from "client/atoms/battle-inputting";
import { LifetimeComponent } from "@rbxts/react-lifetime-component";

type TargetSelectionProps = {
	targets: Array<CardTarget>;
};

export function TargetSelection(props: TargetSelectionProps) {
	return (
		<LifetimeComponent>
			{props.targets.map((target, index) => {
				return (
					<TargetCrosshair
						key={`${index}`}
						target={target.model}
						selected={target.selected}
					/>
				);
			})}
		</LifetimeComponent>
	);
}
