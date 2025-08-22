import { useInterval } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, Number } from "@rbxts/ui-labs";
import { ToastViewport } from "client/components/toast";
import { ClientToast } from "shared/types/toast";

const controls = {
	amount: Number(1, 1, 15),
};

type Component = {
	amount: number;
};

function Component({ amount }: Component) {
	// This is to simulate dropping in notifications and removing
	const [realAmount, setRealAmount] = useState(amount);
	useInterval(() => {
		setRealAmount(math.max(realAmount - 1, 0));
	}, 1);

	const toastTable = new Set<ClientToast>();

	for (const index of $range(1, realAmount)) {
		toastTable.add({
			message: `Message: ${amount - index + 1}`,
			color: "Blue",
			id: amount - index,
		});
	}
	return <ToastViewport toasts={toastTable}></ToastViewport>;
}

export = CreateReactStory(
	{ react: React, reactRoblox: ReactRoblox, controls: controls },
	(props) => {
		return <Component amount={props.controls.amount}></Component>;
	},
);
