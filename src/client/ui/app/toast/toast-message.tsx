import { useMotion, useMountEffect } from "@rbxts/pretty-react-hooks";
import React, { ReactNode, useBinding } from "@rbxts/react";
import { useLifetimeAsync } from "@rbxts/react-lifetime-component";
import { toastAtom } from "client/atoms/toast";
import { getColor3 } from "shared/types/color";
import { ToastEntry } from "shared/types/toast";

export function ToastMessage(props: ToastEntry): ReactNode {
	const [instantDelete, setInstantDelete] = useBinding(false);
	const [frameSize, frameSizeMotion] = useMotion(UDim2.fromScale(0, 1));
	const [transparency, transparencyMotion] = useMotion(0);

	useLifetimeAsync(props, async () => {
		if (instantDelete.getValue()) {
			return;
		}
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
		<textbutton
			Event={{
				MouseButton1Click: () => {
					setInstantDelete(true);
					toastAtom((current) => current.filter((t) => t.id !== props.id));
				},
			}}
			AutoButtonColor={false}
			TextScaled={true}
			BorderSizePixel={0}
			AnchorPoint={new Vector2(1, 0.5)}
			Size={frameSize}
			Transparency={transparency}
			BackgroundColor3={getColor3(props.color)}
			Text={props.message}
			LayoutOrder={-props.id}
		></textbutton>
	);
}
