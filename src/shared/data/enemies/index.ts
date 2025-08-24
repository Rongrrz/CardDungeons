import { blueSlimeEnemy } from "./enemies/blue-slime";
import { greenSlimeEnemy } from "./enemies/green-slime";
import { EnemyName } from "./codenames";
import { EnemyData } from "./types";

export const enemies: Record<EnemyName, EnemyData> = {
	greenSlime: greenSlimeEnemy,
	blueSlime: blueSlimeEnemy,
};
