import { blueSlime } from "./enemies/blue-slime";
import { greenSlime } from "./enemies/green-slime";
import { EnemyName } from "./codenames";
import { EnemyData } from "./types";

export const ENEMY: Record<EnemyName, EnemyData> = {
	greenSlime: greenSlime,
	blueSlime: blueSlime,
};
