import { useMountEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, Number } from "@rbxts/ui-labs";
import { ToastViewport } from "client/components/toast";
import { newToast, toastAtom } from "client/stores/toast";

const controls = {
	amount: Number(1, 1, 15),
};

type Component = {
	amount: number;
};

function Component(props: Component) {
	const toastViewportItems = useAtom(toastAtom);
	useMountEffect(() => {
		task.spawn(() => {
			for (const index of $range(1, props.amount)) {
				const message = `Message: ${props.amount - index + 1}`;
				newToast({ message: message, color: "Blue" });
				task.wait(0.5);
			}
		});
	});
	return <ToastViewport toasts={toastViewportItems}></ToastViewport>;
}

export = CreateReactStory(
	{ react: React, reactRoblox: ReactRoblox, controls: controls },
	(props) => {
		return <Component amount={props.controls.amount}></Component>;
	},
);
