import { Combatant } from "server/battle/combatant";
import { MoveController } from "server/battle/controllers/move-controller";
import { BaseStats } from "shared/types/battle/shared";

const stats1: BaseStats = {
	attack: 12,
	defense: 5,
	maxHp: 40,
	speed: 10,
};

export const mockEnemyData: Array<Combatant> = [
	new Combatant("a", true, 1, stats1, new MoveController()),
	new Combatant("a", true, 2, stats1, new MoveController()),
];
