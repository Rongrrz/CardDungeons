import { Workspace } from "@rbxts/services";

export function getCombatantModel(isEnemy: boolean, slot: number): Model | undefined {
	const [modelFolder, prefix] = isEnemy
		? [Workspace.Temporary.BattleEnemies, "e"]
		: [Workspace.Temporary.BattlePlayers, "p"];
	const model = modelFolder.FindFirstChild(`${prefix}-${slot}`);
	const isModel = model?.IsA("Model");
	return isModel ? model : undefined;
}
