import { CardName } from "shared/data/cards/codenames";
import { Combatant } from "./combatant";
import { OnUseReplicationInfo } from "shared/types/battle/battle";

export type OnUseResolver = (
	card: CardName,
	quality: number,
	user: Combatant,
	targets: Combatant[],
) => OnUseReplicationInfo;
