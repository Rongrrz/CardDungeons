import { Card } from "shared/types/cards";
import { Combatant, PlayerCombatant } from "./combatant";
import { CardRoleType } from "shared/data/cards/card-role";
import { cards } from "shared/data/cards";

type EffectResolver = (cardUsed: Card, user: PlayerCombatant, targets: Combatant[]) => void;

// TODO: Add before/after card effect hooks
const resolveAttackCard: EffectResolver = (cardUsed, user, targets) => {
	const card = cards[cardUsed.card];
	for (const t of targets) {
		const damageTaken = t.takeDamage((card.base / 100) * (cardUsed.quality / 100), user);
		print(`Damage taken: ${damageTaken}`);
	}
};

const resolveSupportCard = () => {
	// TODO: Fill this in later when working on marks, statuses, and buffs
};

const resolvers: Record<CardRoleType, EffectResolver> = {
	[CardRoleType.Attack]: resolveAttackCard,
	[CardRoleType.Support]: resolveSupportCard,
};

export function resolveCardEffect(cardUsed: Card, user: PlayerCombatant, targets: Combatant[]) {
	const role = cards[cardUsed.card].cardRole;
	const resolver = resolvers[role];
	if (resolver === undefined) return warn(`Resolver for role ${role} DNE`);
	resolver(cardUsed, user, targets);
}
