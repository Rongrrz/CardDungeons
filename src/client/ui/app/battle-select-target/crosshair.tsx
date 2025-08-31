import { useMotion, useMountEffect } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { Selected } from "client/constants/selected";

type TargetCrosshairProps = {
	target: Model;
	selected: Selected;
};

const transparencyGoal: Record<Selected, number> = {
	[Selected.NotSelected]: 0.75,
	[Selected.Selected]: 0,
	[Selected.Partially]: 0.25,
};

const colorGoal: Record<Selected, Color3> = {
	[Selected.Selected]: Color3.fromRGB(255, 100, 0),
	[Selected.NotSelected]: Color3.fromRGB(255, 255, 255),
	[Selected.Partially]: Color3.fromRGB(255, 100, 0),
};

export function TargetCrosshair(props: TargetCrosshairProps) {
	const [color, colorMotion] = useMotion<Color3>(Color3.fromRGB(255, 150, 0));
	const [transparency, transparencyMotion] = useMotion(0.75);
	const [rotation, rotationMotion] = useMotion(0);

	// A continuous spinning effect
	useMountEffect(() => {
		rotationMotion.tween(360, { time: 20, repeatCount: -1, style: Enum.EasingStyle.Linear });
	});

	// When selection status changes, also change the aesthetics of the UI
	useEffect(() => {
		transparencyMotion.spring(transparencyGoal[props.selected]);
		colorMotion.spring(colorGoal[props.selected]);
	}, [props.selected]);

	return (
		<billboardgui Size={UDim2.fromScale(4, 4)} AlwaysOnTop={true} Adornee={props.target}>
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
