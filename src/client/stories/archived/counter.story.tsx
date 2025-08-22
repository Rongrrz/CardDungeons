import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import { Counter } from "client/components/archived/counter";

export = CreateReactStory({ react: React, reactRoblox: ReactRoblox }, () => {
	return <Counter></Counter>;
});
