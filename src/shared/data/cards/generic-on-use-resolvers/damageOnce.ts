import { EffectResolver, ICombatant } from "shared/types/battle";
import { CardInfo } from "shared/types/cards";

export const resolveDamageOnce: EffectResolver = (
	card: CardInfo,
	quality: number,
	user: ICombatant,
	targets: ICombatant[],
) => {
	for (const t of targets) {
		const damageTaken = t.takeDamage((card.base / 100) * (quality / 100), user);
		print(`Damage dealt: ${damageTaken}`);
	}
};
