import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { fieldCombatantsAtom } from "client/atoms/battle-inputting";
import { HealthBar } from "./health-bar";

export function StatusBars() {
	const targets = useAtom(fieldCombatantsAtom);

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
