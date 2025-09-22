import { OnUseReplicationInfo } from "shared/types/battle/battle";
import { OnUseResolver } from "../types";
import { CARD } from "shared/data/cards";

export const resolveDamageOnce: OnUseResolver = (cardName, quality, user, targets) => {
	const result: OnUseReplicationInfo = new Array();
	const card = CARD[cardName];
	for (const t of targets) {
		const damageTaken = t.takeDamage((card.base / 100) * (quality / 100), user);
		result.push({
			isEnemy: t.isEnemy,
			slot: t.slot,
			numbers: [{ number: damageTaken, damageType: "damage" }],
			finalHp: t.getStats().hp,
			finalMaxHp: t.getStats().maxHp,
		});
	}
	return result;
};
