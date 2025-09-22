import { useMotion, useMountEffect } from "@rbxts/pretty-react-hooks";
import React, { ReactNode, useEffect } from "@rbxts/react";
import { useLifetimeAsync } from "@rbxts/react-lifetime-component";
import { Selected } from "client/constants/selected";

const transparencyGoal: Record<Selected, number> = {
	[Selected.NotSelected]: 0.75,
	[Selected.Selected]: 0,
	[Selected.Partially]: 0.25,
};

const colorGoal: Record<Selected, Color3> = {
	[Selected.Selected]: Color3.fromRGB(255, 255, 255),
	[Selected.NotSelected]: Color3.fromRGB(255, 255, 255),
	[Selected.Partially]: Color3.fromRGB(255, 255, 255),
};

export function TargetCrosshair(props: { target: Model; selected: Selected }): ReactNode {
	const [color, colorMotion] = useMotion<Color3>(Color3.fromRGB(255, 255, 255));
	const [transparency, transparencyMotion] = useMotion(0.75);
	const [rotation, rotationMotion] = useMotion(0);
	const [size, sizeMotion] = useMotion(UDim2.fromScale(8, 8));

	// A continuous spinning effect
	useMountEffect(() => {
		rotationMotion.tween(360, { time: 20, repeatCount: -1, style: Enum.EasingStyle.Linear });
	});

	// Start extremely big and shrink to normal-size
	useMountEffect(() => {
		sizeMotion.spring(UDim2.fromScale(4, 4));
	});

	useLifetimeAsync(props, () => {
		return Promise.try(async () => {
			transparencyMotion.spring(1);
			sizeMotion.tween(UDim2.fromScale(8, 8), {
				time: 0.35,
				style: Enum.EasingStyle.Linear,
				direction: Enum.EasingDirection.InOut,
			});
			task.wait(0.35);
		});
	});

	// When selection status changes, also change the aesthetics of the UI
	useEffect(() => {
		transparencyMotion.spring(transparencyGoal[props.selected]);
		colorMotion.spring(colorGoal[props.selected]);
	}, [props.selected]);

	return (
		<billboardgui Size={size} AlwaysOnTop={true} Adornee={props.target}>
			<imagelabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				Position={UDim2.fromScale(0.5, 0.5)}
				BackgroundTransparency={1}
				Image={"rbxassetid://95895253668497"}
				ImageColor3={color}
				ImageTransparency={transparency}
				Rotation={rotation}
			/>
		</billboardgui>
	);
}
