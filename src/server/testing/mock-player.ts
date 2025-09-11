import { Players } from "@rbxts/services";
import { Combatant } from "server/battle/combatant";
import { CardController } from "server/battle/controllers/card-controller";
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
	quality: 88,
});

const ThetaEngineer = Players.WaitForChild("ThetaEngineer") as unknown as Player;

export const mockThetaEngineer: Combatant = new Combatant(
	1,
	{ attack: 15, defense: 5, maxHp: 100, speed: 15 },
	new CardController(ThetaEngineer, mockDeck),
);
