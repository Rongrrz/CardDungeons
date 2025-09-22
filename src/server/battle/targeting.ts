import { CardTargetType } from "shared/data/cards/card-target";
import { Combatant, PlayerCombatant } from "./combatant";

type TargetResolver = (
	user: Combatant,
	targetSlot: number,
	combatants: Combatant[],
) => Array<Combatant>;

const allTargets: TargetResolver = (_u, _s, combatants) => [...combatants];

const userOnly: TargetResolver = (user) => [user];

const allEnemyTeam: TargetResolver = (_u, _s, combatants) =>
	combatants.filter((c) => c.isEnemy === true);

const allUserTeam: TargetResolver = (_u, _s, combatants) =>
	combatants.filter((c) => c.isEnemy === false);

const singleEnemy: TargetResolver = (_u, slot, combatants) => {
	const enemy = combatants.find((c) => c.slot === slot && c.isEnemy === true);
	return enemy ? [enemy] : [];
};
const singleAlly: TargetResolver = (_u, slot, playerTeam) => {
	const ally = playerTeam.find((c) => c.slot === slot && c.isEnemy === false);
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
	combatants: Combatant[],
): Array<Combatant> {
	const resolver = resolvers[targetType];
	return resolver ? resolver(user, targetSlot, combatants) : [];
}
