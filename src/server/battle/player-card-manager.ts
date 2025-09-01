import { knuthShuffleInPlace } from "shared/dsa/knuthShuffle";
import { IPlayerCardManager } from "shared/interfaces/player-card-manager";
import { Card } from "shared/types/cards";

export class PlayerCardManager implements IPlayerCardManager {
	// deck -> hand -> used; deck = [deck + used]
	private deck: Array<Card>;
	private used = new Array<Card>(); // Keeps track of the used indexes in deck
	private hand = new Array<Card>(); // Cards player current have in their hand
	private readonly totalCards: number;

	public constructor(deck: Array<Card>) {
		// Pollute the player's deck with "Empty" cards if needed
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
