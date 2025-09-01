import { CreateReactStory, Number } from "@rbxts/ui-labs";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CardContainer } from "client/ui/app/battle-card";
import { ClientCard } from "shared/data/cards/types";
import { cardContainerCards, isCardContainerIn } from "client/atoms/battle-inputting";

const controls = {
	amount: Number(1, 1, 10),
};

type Component = {
	amount: number;
};

function Component(props: Component) {
	const cardTable = new Array<ClientCard>();

	for (const _ of $range(1, props.amount)) {
		cardTable.push({
			card: "fireball",
			quality: math.random(80, 100),
		});
	}
	cardContainerCards(cardTable);
	isCardContainerIn(true);
	return <CardContainer />;
}

export = CreateReactStory(
	{ react: React, reactRoblox: ReactRoblox, controls: controls },
	(props) => {
		return <Component amount={props.controls.amount}></Component>;
	},
);
