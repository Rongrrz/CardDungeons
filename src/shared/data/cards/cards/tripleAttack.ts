import { calculateMultiplier } from "../utils";
import { CardTargetType } from "../card-target";
import { CardInfo } from "shared/types/battle/cards";
import { ICombatant } from "shared/types/battle/shared";

export const tripleAttack: CardInfo = {
	displayName: "Triple Swipe",
	manaCost: 25,
	base: 80,
	priority: 10,
	cardTarget: CardTargetType.AllEnemyTeam,
	getDesc(quality) {
		const calculated = calculateMultiplier(this.base, quality);
		return `Attacks an enemy 3 times, dealing ${calculated}% of attack as damage. The last attack also damages all targets.`;
	},
	onUse: (card: CardInfo, quality: number, user: ICombatant, targets: ICombatant[]) => {
		if (targets.size() < 1) return [];

		const hit1 = targets[0].takeDamage((card.base / 100) * (quality / 100), user);
		const hit2 = targets[0].takeDamage((card.base / 100) * (quality / 100), user);
		print(`Hit1: ${hit1}, Hit2: ${hit2}`);

		for (const t of targets) {
			const damageTaken = t.takeDamage((card.base / 100) * (quality / 100), user);
			print(`Damage dealt: ${damageTaken}`);
		}
		return [];
	},
};
