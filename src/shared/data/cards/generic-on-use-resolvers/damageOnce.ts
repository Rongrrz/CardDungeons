import { CardInfo, OnUseResolver } from "shared/types/battle/cards";
import { ICombatant, OnUseReplicationInfo } from "shared/types/battle/shared";

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
			numbers: [{ number: damageTaken, numberType: "normal" }],
			finalHp: t.getStats().hp,
			finalMaxHp: t.getStats().maxHp,
		});
	}
	return result;
};
