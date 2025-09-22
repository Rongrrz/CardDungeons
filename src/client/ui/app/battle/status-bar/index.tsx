import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { combatantModels } from "client/atoms/battle-inputting";
import { HealthBar } from "./health-bar";

export function StatusBars() {
	const targets = useAtom(combatantModels);

	return (
		<>
			{targets.map((target) => {
				return (
					<HealthBar
						key={target.model.Name}
						target={target.model}
						maxhp={target.maxhp}
						hp={target.hp}
					/>
				);
			})}
		</>
	);
}
