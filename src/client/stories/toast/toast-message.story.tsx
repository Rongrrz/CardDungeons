import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import { ToastMessage } from "client/components/toast/toast-message";

export = CreateReactStory({ react: React, reactRoblox: ReactRoblox }, () => {
	return <ToastMessage message={"Hello"} color={"Green"} id={1} />;
});
