import { useMotion, useMountEffect } from "@rbxts/pretty-react-hooks";
import React, { ReactNode } from "@rbxts/react";
import { useLifetimeAsync } from "@rbxts/react-lifetime-component";
import { getColor3 } from "shared/types/color";
import { ClientToast } from "shared/types/toast";

export function ToastMessage(props: ClientToast): ReactNode {
	const [frameSize, frameSizeMotion] = useMotion(UDim2.fromScale(0, 1));
	const [transparency, transparencyMotion] = useMotion(0);

	useLifetimeAsync(props, async () => {
		return Promise.try(() => {
			transparencyMotion.tween(1, {
				time: 1,
				style: Enum.EasingStyle.Linear,
				direction: Enum.EasingDirection.Out,
			});
			task.wait(1);
		});
	});

	useMountEffect(() => {
		frameSizeMotion.spring(UDim2.fromScale(1, 1));
	});

	return (
		<textlabel
			TextScaled={true}
			BorderSizePixel={0}
			AnchorPoint={new Vector2(1, 0.5)}
			Position={UDim2.fromScale(1, 0.5)}
			Size={frameSize}
			Transparency={transparency}
			BackgroundColor3={getColor3(props.color)}
			Text={props.message}
			LayoutOrder={-props.id}
		></textlabel>
	);
}
