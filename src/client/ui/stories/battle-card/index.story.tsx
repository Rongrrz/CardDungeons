import { CreateReactStory, Number } from "@rbxts/ui-labs";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CardViewport } from "client/ui/app/battle-card";
import { ClientCard } from "shared/data/cards/types";

const controls = {
	amount: Number(1, 1, 10),
};

type Component = {
	amount: number;
};

function Component(props: Component) {
	const cardTable = new Array<ClientCard>();

	for (const index of $range(1, props.amount)) {
		cardTable.push({
			card: "fireball",
			quality: math.random(80, 100),
		});
	}
	return <CardViewport cards={cardTable} in={true}></CardViewport>;
}

export = CreateReactStory(
	{ react: React, reactRoblox: ReactRoblox, controls: controls },
	(props) => {
		return <Component amount={props.controls.amount}></Component>;
	},
);
