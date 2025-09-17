import { CardTargetType } from "shared/data/cards/card-target";
import { Combatant, PlayerCombatant } from "./combatant";

type TargetResolver = (
	user: Combatant,
	targetSlot: number,
	playerTeam: Combatant[],
	enemyTeam: Combatant[],
) => Array<Combatant>;

const allTargets: TargetResolver = (_u, _s, playerTeam, enemyTeam) => [...playerTeam, ...enemyTeam];
const userOnly: TargetResolver = (user) => [user];
const allEnemyTeam: TargetResolver = (_u, _s, _pt, enemyTeam) => enemyTeam;
const allUserTeam: TargetResolver = (_u, _s, playerTeam) => playerTeam;
const singleEnemy: TargetResolver = (_u, slot, _pt, enemyTeam) => {
	const enemy = enemyTeam.find((c) => c.slot === slot);
	return enemy ? [enemy] : [];
};
const singleAlly: TargetResolver = (_u, slot, playerTeam) => {
	const ally = playerTeam.find((c) => c.slot === slot);
	return ally ? [ally] : [];
};

const resolvers: Record<CardTargetType, TargetResolver> = {
	[CardTargetType.All]: allTargets,
	[CardTargetType.User]: userOnly,
	[CardTargetType.AllEnemyTeam]: allEnemyTeam,
	[CardTargetType.AllUserTeam]: allUserTeam,
	[CardTargetType.SingleEnemy]: singleEnemy,
	[CardTargetType.SingleUserTeam]: singleAlly,
};

export function getCardTargets(
	targetType: CardTargetType,
	user: PlayerCombatant,
	targetSlot: number,
	playerTeam: Combatant[],
	enemyTeam: Combatant[],
): Array<Combatant> {
	const resolver = resolvers[targetType];
	return resolver ? resolver(user, targetSlot, playerTeam, enemyTeam) : [];
}
