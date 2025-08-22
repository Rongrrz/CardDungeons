import React, { StrictMode } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players, RunService } from "@rbxts/services";
import { App } from "./app";

const root = createRoot(new Instance("Folder"));
const target = Players.LocalPlayer.WaitForChild("PlayerGui");

const ScreenGui = new Instance("ScreenGui");
ScreenGui.Parent = target;

root.render(
	createPortal(
		RunService.IsStudio() ? (
			<StrictMode>
				<App />
			</StrictMode>
		) : (
			<App />
		),
		ScreenGui,
	),
);
