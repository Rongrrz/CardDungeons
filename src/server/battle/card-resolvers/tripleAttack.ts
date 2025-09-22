import { OnUseReplicationInfo } from "shared/types/battle/battle";
import { OnUseResolver } from "../types";
import { CARD } from "shared/data/cards";

export const resolveTripleAttack: OnUseResolver = (cardName, quality, user, targets) => {
	// TODO: Populate result
	const result: OnUseReplicationInfo = [];
	const card = CARD[cardName];

	if (targets.size() < 1) return result;
	const hit1 = targets[0].takeDamage((card.base / 100) * (quality / 100), user);
	const hit2 = targets[0].takeDamage((card.base / 100) * (quality / 100), user);
	print(`Hit1: ${hit1}, Hit2: ${hit2}`);

	for (const t of targets) {
		const damageTaken = t.takeDamage((card.base / 100) * (quality / 100), user);
		print(`Damage dealt: ${damageTaken}`);
	}
	return result;
};
