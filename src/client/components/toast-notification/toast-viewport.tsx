import React, { ReactNode } from "@rbxts/react";
import { ClientToast } from "shared/types/notification";
import { ToastMessage } from "./toast-message";
import { LifetimeComponent } from "@rbxts/react-lifetime-component";

type ToastViewportProps = {
	toasts: Set<ClientToast>;
};

export function ToastViewport(props: ToastViewportProps): ReactNode {
	return (
		<frame
			Transparency={1}
			Size={UDim2.fromScale(0.3, 0.035)}
			AnchorPoint={new Vector2(1, 1)}
			Position={new UDim2(1, -5, 1, -5)}
		>
			<uilistlayout
				Padding={new UDim(-2, -5)}
				HorizontalAlignment={"Right"}
				SortOrder={"LayoutOrder"}
			></uilistlayout>

			<LifetimeComponent>
				{[...props.toasts].map((toast) => {
					return (
						<ToastMessage
							key={tostring(toast.id)}
							message={tostring(toast.message)}
							color={toast.color}
							id={toast.id}
						></ToastMessage>
					);
				})}
			</LifetimeComponent>
		</frame>
	);
}
