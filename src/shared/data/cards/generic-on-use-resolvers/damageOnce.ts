import { OnUseResolver, ICombatant, OnUseReplicationInfo } from "shared/types/battle";
import { CardInfo } from "shared/types/cards";

export const resolveDamageOnce: OnUseResolver = (
	card: CardInfo,
	quality: number,
	user: ICombatant,
	targets: ICombatant[],
) => {
	const result: OnUseReplicationInfo = new Array();
	for (const t of targets) {
		const damageTaken = t.takeDamage((card.base / 100) * (quality / 100), user);
		result.push({
			isEnemy: t.isEnemy,
			slot: t.slot,
			numbers: [{ damage: damageTaken, crit: false }],
		});
	}
	return result;
};
