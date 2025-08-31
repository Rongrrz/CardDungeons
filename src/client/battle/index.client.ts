import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { cardTargetsAtom, inputtingAtom } from "client/atoms/battle-inputting";
import { playerModel } from "client/constants/battle";
import { Selected } from "client/constants/selected";
import { enemyModels } from "shared/data/enemies/models";
import { Battle } from "shared/types/battle";

const receivePlayerInput = ReplicatedStorage.Remotes.ReceivePlayerInput;
const initializeBattleVisuals = ReplicatedStorage.Remotes.InitializeBattleVisuals;

const mouse = Players.LocalPlayer.GetMouse();
const targets = new Array<Model>();
let prevTarget: Instance | undefined = undefined;

// TODO: Change server-side receiver to be RemoteFunction, for invalid player input
function handleReceivePlayerInput() {
	inputtingAtom((curr) => !curr);
	// print("Handle Receive Player Input");
}

function handleInitializeBattleVisuals(battle: Omit<Battle, "enemyData">) {
	const mouseConn = mouse.Move.Connect(() => {
		const target = mouse.Target;
		if (target === prevTarget) return;
		prevTarget = target;

		const hovered = target ? targets.find((e) => target.IsDescendantOf(e)) : undefined;

		cardTargetsAtom((prev) => {
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

	battle.enemies.forEach((enemy, index) => {
		const model = enemyModels[enemy.name] ?? enemyModels.greenSlime;
		const clone = model.Clone();
		clone.Name = `${index + 1}`;
		const node = Workspace.Battlefield.Enemy.FindFirstChild(index + 1) as unknown as Part;

		const yBump = new Vector3(0, clone.GetExtentsSize().Y / 2 - node.Size.Y / 2, 0);
		clone.PivotTo(node.CFrame.mul(new CFrame(0, yBump.Y, 0)));
		clone.Parent = Workspace.Temporary.BattleEnemies;

		targets.push(clone);
		cardTargetsAtom((current) => [
			...current,
			{ model: clone, selected: Selected.NotSelected },
		]);
	});

	battle.players.forEach((player, index) => {
		const clone = playerModel.Clone();
		clone.Name = `${player.id}`;
		const node = Workspace.Battlefield.Player.FindFirstChild(index + 1) as unknown as Part;

		const yBump = new Vector3(0, clone.GetExtentsSize().Y / 2 - node.Size.Y / 2, 0);
		clone.PivotTo(node.CFrame.add(new Vector3(0, yBump.Y, 0)));
		clone.Parent = Workspace.Temporary.BattlePlayers;
	});
	initializeBattleVisuals.FireServer(); // Tells the player that we have finished initializing
}

receivePlayerInput.OnClientEvent.Connect(handleReceivePlayerInput);
initializeBattleVisuals.OnClientEvent.Connect(handleInitializeBattleVisuals);
