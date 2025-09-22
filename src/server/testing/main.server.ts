task.wait(3);

import { Battle } from "server/battle";
import { mockEnemyData } from "./mock-enemy";
import { mockThetaEngineer } from "./mock-player";

// Create a battle
const battle = new Battle([mockThetaEngineer], mockEnemyData);
battle.startBattle();
