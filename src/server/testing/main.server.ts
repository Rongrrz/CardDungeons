import { createBattle } from "../battle/engine";
import { toastAllPlayers } from "../toast/toast";
import { mockEnemyData } from "./mock-enemy";
import { mockThetaEngineer } from "./mock-player";

// Create a battle
task.wait(3);
toastAllPlayers("Creating a battle");
createBattle({
	enemyData: mockEnemyData,
	playerData: [mockThetaEngineer],
});
