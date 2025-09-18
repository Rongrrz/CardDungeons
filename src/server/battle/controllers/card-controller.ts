import { knuthShuffleInPlace } from "shared/dsa/knuthShuffle";
import { Card } from "shared/types/cards";
import { MoveController } from "./move-controller";

export class CardController {
	public owner: Player;
	private deck: Array<Card>;
	private used = new Array<Card>(); // Keeps track of the used indexes in deck
	private hand = new Array<Card>(); // Cards player current have in their hand
	public readonly totalCards: number;

	public constructor(owner: Player, playerDeck: Array<Card>) {
		this.owner = owner;

		// Initialize our deck, polluting it with bad fireballs (for now) as needed
		this.deck = [...playerDeck];
		while (this.deck.size() < 1) {
			this.deck.push({
				card: "fireball",
				quality: 80,
			});
		}
		this.totalCards = this.deck.size();

		// Shuffles the player's deck and initialize starting hand
		knuthShuffleInPlace(this.deck);
		for (const _ of $range(1, this.totalCards)) {
			this.hand.push(this.deck.pop()!);
		}
	}

	public getHand(): Array<Card> {
		return this.hand;
	}

	public spendCard(card: Card): boolean {
		const index = this.hand.findIndex(
			(c) => c.card === card.card && c.quality === card.quality,
		);
		const usedCard = this.hand.remove(index);
		if (usedCard === undefined) return false;
		this.used.push(usedCard);
		return true;
	}
}

export function isCardController(c: unknown) {
	return c instanceof CardController;
}

export function isMoveController(c: unknown) {
	return c instanceof MoveController;
}
