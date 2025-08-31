import { peek, subscribe } from "@rbxts/charm";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import {
	cardContainerCards,
	cardTargets,
	isCardContainerIn,
	usingCardSlotAtom,
} from "client/atoms/battle-inputting";
import { playerModel } from "client/constants/battle";
import { Selected } from "client/constants/selected";
import { enemyModels } from "shared/data/enemies/models";
import { Battle } from "shared/types/battle";
import { Card } from "shared/types/cards";

const receivePlayerInput = ReplicatedStorage.Remotes.ReceivePlayerInput;
const initializeBattleVisuals = ReplicatedStorage.Remotes.InitializeBattleVisuals;

const mouse = Players.LocalPlayer.GetMouse();
const models = new Array<Model>();
let prevTarget: Instance | undefined = undefined;

let usedCards = new Array<Card>(); // Cards used for the current player-input cycle
let localHand = new Array<Card>(); // Cards players have for the current player-input cycle

subscribe(usingCardSlotAtom, (newState) => {
	// TODO: Change this logic to change cardTargets when card slots are different
	cardTargets(
		newState === undefined
			? []
			: models.map((model) => ({ model: model, selected: Selected.NotSelected })),
	);
});

// TODO: Change server-side receiver to be RemoteFunction, for invalid player input
function handleReceivePlayerInput(hand: Array<Card>) {
	localHand = hand;
	usedCards = [];

	cardContainerCards(hand); // Populate the inputting GUI
	isCardContainerIn(true);

	const mouseConnection = mouse.Move.Connect(() => {
		// Discontinue if no card is selected
		if (peek(usingCardSlotAtom) === undefined) return;

		// If we are hovering onto the same thing, no need to do anything either
		const mouseTarget = mouse.Target;
		if (mouseTarget === prevTarget) return;
		prevTarget = mouseTarget;

		const hovered = mouseTarget ? models.find((m) => mouseTarget.IsDescendantOf(m)) : undefined;

		cardTargets((prev) => {
			let changed = false;
			const updated = prev.map((entry) => {
				const isSelected = hovered
					? hovered === entry.model
						? Selected.Selected
						: Selected.NotSelected
					: Selected.NotSelected;
				if (entry.selected !== isSelected) {
					changed = true;
					return { ...entry, selected: isSelected };
				}
				return entry;
			});
			return changed ? updated : prev;
		});
	});

	// Once finish
	// inputtingAtom(false);
}

function handleInitializeBattleVisuals(battle: Omit<Battle, "enemyData">) {
	battle.enemies.forEach((enemy, index) => {
		const model = enemyModels[enemy.name] ?? enemyModels.greenSlime;
		const clone = model.Clone();
		clone.Name = `${index + 1}`;
		const node = Workspace.Battlefield.Enemy.FindFirstChild(index + 1) as unknown as Part;

		const yBump = new Vector3(0, clone.GetExtentsSize().Y / 2 - node.Size.Y / 2, 0);
		clone.PivotTo(node.CFrame.mul(new CFrame(0, yBump.Y, 0)));
		clone.Parent = Workspace.Temporary.BattleEnemies;

		models.push(clone);
	});

	let index = 0;
	battle.players.forEach((player, id) => {
		const clone = playerModel.Clone();
		clone.Name = `${id}`;
		const node = Workspace.Battlefield.Player.FindFirstChild(++index) as unknown as Part;

		const yBump = new Vector3(0, clone.GetExtentsSize().Y / 2 - node.Size.Y / 2, 0);
		clone.PivotTo(node.CFrame.add(new Vector3(0, yBump.Y, 0)));
		clone.Parent = Workspace.Temporary.BattlePlayers;
	});
	initializeBattleVisuals.FireServer(); // Tells the player that we have finished initializing
}

receivePlayerInput.OnClientEvent.Connect(handleReceivePlayerInput);
initializeBattleVisuals.OnClientEvent.Connect(handleInitializeBattleVisuals);
