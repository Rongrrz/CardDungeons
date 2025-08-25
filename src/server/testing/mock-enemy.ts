import { Queue } from "shared/dsa/queue";
import { BattleEnemy, EnemyData } from "shared/types/battle";

const mockEnemies = new Queue<BattleEnemy>();
mockEnemies.add({
	name: "blueSlime",
	stats: {
		hp: 40,
		attack: 12,
		defense: 5,
	},
});

mockEnemies.add({
	name: "greenSlime",
	stats: {
		hp: 40,
		attack: 12,
		defense: 5,
	},
});

export const mockEnemyData: EnemyData = {
	type: "continuous",
	maxConcurrentEnemy: 2,
	enemies: mockEnemies,
};
