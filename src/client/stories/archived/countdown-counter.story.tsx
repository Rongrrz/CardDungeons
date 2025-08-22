import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import { CountdownCounter } from "client/components/archived/countdown-counter";

export = CreateReactStory({ react: React, reactRoblox: ReactRoblox }, () => {
	return <CountdownCounter></CountdownCounter>;
});
