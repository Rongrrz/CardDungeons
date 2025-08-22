import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import { App } from "client/app/app";

export = CreateReactStory({ react: React, reactRoblox: ReactRoblox }, () => {
	return <App />;
});
