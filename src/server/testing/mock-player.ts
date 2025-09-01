import { PlayerData } from "shared/types/battle";
import { Card } from "shared/types/cards";

const mockDeck = new Array<Card>();
for (const _ of $range(1, 1)) {
	mockDeck.push({
		card: "fireball",
		quality: math.random(80, 100),
	});
}
mockDeck.push({
	card: "lightningStorm",
	quality: math.random(80, 100),
});

mockDeck.push({
	card: "enhance",
	quality: 888,
});

export const mockThetaEngineer: PlayerData = {
	id: 8306213857,
	stats: {
		hp: 100,
		attack: 15,
		defense: 5,
	},
	deck: mockDeck,
};
