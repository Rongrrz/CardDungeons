import { CreateReactStory, Number } from "@rbxts/ui-labs";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CardContainer } from "client/ui/app/battle/card-interface";
import { isCardTrayOpenAtom, cardInHandAtom } from "client/atoms/battle-inputting";
import { Card } from "shared/types/battle/cards";

const controls = {
	amount: Number(1, 1, 10),
};

type Component = {
	amount: number;
};

function Component(props: Component) {
	const cardTable = new Array<Card>();

	for (const _ of $range(1, props.amount)) {
		cardTable.push({
			card: "fireball",
			quality: math.random(80, 100),
		});
	}
	cardInHandAtom(cardTable);
	isCardTrayOpenAtom(true);
	return <CardContainer />;
}

export = CreateReactStory(
	{ react: React, reactRoblox: ReactRoblox, controls: controls },
	(props) => {
		return <Component amount={props.controls.amount}></Component>;
	},
);
