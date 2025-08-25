import { Card } from "shared/types/cards";

export interface IPlayerCardManager {
	getHand(): ReadonlyArray<Card>;
}
