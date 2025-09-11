import { knuthShuffleInPlace } from "shared/dsa/knuthShuffle";
import { Card } from "shared/types/cards";
import { MoveController } from "./move-controller";

export class CardController {
	public owner: Player;
	private deck: Array<Card>;
	private used = new Array<Card>(); // Keeps track of the used indexes in deck
	private hand = new Array<Card>(); // Cards player current have in their hand
	public readonly totalCards: number;

	public constructor(owner: Player, deck: Array<Card>) {
		this.owner = owner;

		// Initialize our deck, polluting it with empty as needed
		this.deck = [...deck];
		while (this.deck.size() < 10) {
			this.deck.push({
				card: "empty",
				quality: 0,
			});
		}
		this.totalCards = deck.size();

		// Shuffles the player's deck and initialize starting hand
		knuthShuffleInPlace(deck);
		for (const _ of $range(1, 3)) {
			this.hand.push(deck.pop()!);
		}
	}

	public getHand(): Array<Card> {
		return this.hand;
	}
}

export function isCardController(c: unknown) {
	return c instanceof CardController;
}

export function isMoveController(c: unknown) {
	return c instanceof MoveController;
}
