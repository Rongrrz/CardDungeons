import React, { ReactNode } from "@rbxts/react";
import { TargetCrosshair } from "./crosshair";
import { LifetimeComponent } from "@rbxts/react-lifetime-component";
import { useAtom } from "@rbxts/react-charm";
import { targetMarksAtom } from "client/atoms/battle-inputting";
import { getCombatantModel } from "client/battle/get-combatant-model";

export function TargetSelection(): ReactNode {
	const targets = useAtom(targetMarksAtom);

	return (
		<LifetimeComponent>
			{targets.map((c) => {
				const model = getCombatantModel(c.isEnemy, c.slot);
				if (model === undefined || !model.IsA("Model")) return;
				return <TargetCrosshair key={model.Name} target={model} selected={c.selected} />;
			})}
		</LifetimeComponent>
	);
}
