import { ReplicatedStorage } from "@rbxts/services";
import { EnemyName } from "./codenames";

const models = ReplicatedStorage.Models;

export const enemyModels: Record<EnemyName, Model> = {
	greenSlime: models.GreenSlime,
	blueSlime: models.BlueSlime,
};
