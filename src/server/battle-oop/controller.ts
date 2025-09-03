import { knuthShuffleInPlace } from "shared/dsa/knuthShuffle";
import { Card } from "shared/types/cards";

export class CardController {
	private deck: Array<Card>;
	private used = new Array<Card>(); // Keeps track of the used indexes in deck
	private hand = new Array<Card>(); // Cards player current have in their hand
	private readonly totalCards: number;

	public readonly owner: Player;

	public constructor(owner: Player, deck: Array<Card>) {
		this.owner = owner;

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
		for (let i = 0; i < 3; i++) {
			this.hand.push(deck.pop()!);
		}
	}

	public getHand() {
		return this.hand;
	}
}

export class MoveController {}
