import React, { ReactNode } from "@rbxts/react";
import { LifetimeComponent } from "@rbxts/react-lifetime-component";
import { ToastMessage } from "./toast-message";
import { toastAtom } from "client/atoms/toast";
import { useAtom } from "@rbxts/react-charm";

export function ToastViewport(): ReactNode {
	const toasts = useAtom(toastAtom);
	return (
		<frame
			Transparency={1}
			Size={UDim2.fromScale(0.3, 0.035)}
			AnchorPoint={new Vector2(1, 1)}
			Position={new UDim2(1, -5, 1, -5)}
		>
			<uilistlayout
				Padding={new UDim(-2, -5)}
				HorizontalAlignment={"Right"} // This makes the text spawn from the right
				SortOrder={"LayoutOrder"}
			></uilistlayout>

			<LifetimeComponent>
				{toasts.map((toast) => {
					return (
						<ToastMessage
							key={tostring(toast.id)}
							message={tostring(toast.message)}
							color={toast.color}
							id={toast.id}
						/>
					);
				})}
			</LifetimeComponent>
		</frame>
	);
}
