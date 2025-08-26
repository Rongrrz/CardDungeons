import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { playerModel } from "client/constants/battle";
import { enemyModels } from "shared/data/enemies/models";
import { OldBattle } from "shared/types/battle";

const receivePlayerInput = ReplicatedStorage.Remotes.ReceivePlayerInput;
const initializeBattleVisuals = ReplicatedStorage.Remotes.InitializeBattleVisuals;

function handleReceivePlayerInput() {
	// print("Handle Receive Player Input");
}

function handleInitializeBattleVisuals(battle: Omit<OldBattle, "enemyData">) {
	battle.enemies.forEach((enemy, index) => {
		const model = enemyModels[enemy.name] ?? enemyModels.greenSlime;
		const clone = model.Clone();
		clone.Name = `${index + 1}`;
		const node = Workspace.Battlefield.Enemy.FindFirstChild(index + 1) as unknown as Part;

		const yBump = new Vector3(0, clone.GetExtentsSize().Y / 2 - node.Size.Y / 2, 0);
		clone.PivotTo(node.CFrame.mul(new CFrame(0, yBump.Y, 0)));
		clone.Parent = Workspace.Temporary.BattleEnemies;
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
