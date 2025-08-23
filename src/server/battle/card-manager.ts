import { knuthShuffleInPlace } from "shared/dsa/knuthShuffle";
import { CardName } from "shared/info/cards/codenames";

type Card = {
	card: CardName;
	quality: number;
};

export class PlayerCardManager {
	// deck -> hand -> used; deck = [deck + used]
	private deck: Array<Card>;
	private used = new Array<Card>(); // Keeps track of the used indexes in deck
	private hand = new Array<Card>(); // Cards player current have in their hand
	private totalCards: number;

	public constructor(deck: Array<Card>) {
		this.totalCards = deck.size();
		this.deck = [...deck];

		// Pollute the player's deck with "Empty" cards if needed
		while (this.deck.size() > 10) {
			this.deck.push({
				card: "empty",
				quality: 0,
			});
		}

		// Shuffles the player's deck and initialize starting hand
		knuthShuffleInPlace(deck);
		for (let i = 0; i < 3; i++) {
			this.hand.push(deck.pop()!);
		}
	}
}
