import { useMotion } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { ReactNode } from "@rbxts/react";

export function HealthBar(props: { target: Model; maxhp: number; hp: number }): ReactNode {
	const [size, sizeMotion] = useMotion(UDim2.fromScale(1, 1));

	useEffect(() => {
		sizeMotion.spring(UDim2.fromScale(props.hp / props.maxhp, 1));
	}, [props.hp, props.maxhp]);

	return (
		<billboardgui
			Size={UDim2.fromScale(3, 1)}
			AlwaysOnTop={true}
			Adornee={props.target}
			StudsOffset={new Vector3(0, 3, 0)}
		>
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				Position={UDim2.fromScale(0.5, 0.5)}
				BorderSizePixel={0}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			>
				<frame
					Size={size}
					BorderSizePixel={0}
					BackgroundColor3={Color3.fromRGB(120, 255, 120)}
				/>
				<textlabel
					BackgroundTransparency={1}
					Text={`${props.hp} / ${props.maxhp}`}
					TextScaled={true}
					Size={UDim2.fromScale(1, 1)}
				/>
			</frame>
		</billboardgui>
	);
}
