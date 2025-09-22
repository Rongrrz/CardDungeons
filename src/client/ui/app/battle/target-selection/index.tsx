import React from "@rbxts/react";
import { TargetCrosshair } from "./crosshair";
import { LifetimeComponent } from "@rbxts/react-lifetime-component";
import { useAtom } from "@rbxts/react-charm";
import { cardTargets } from "client/atoms/battle-inputting";

export function TargetSelection() {
	const targets = useAtom(cardTargets);

	return (
		<LifetimeComponent>
			{targets.map((target) => {
				return (
					<TargetCrosshair
						key={target.model.Name}
						target={target.model}
						selected={target.selected}
					/>
				);
			})}
		</LifetimeComponent>
	);
}
