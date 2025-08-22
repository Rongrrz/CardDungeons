import { CardData } from "../cards";

export const lightningStormCard: CardData = {
    displayName: "Lightning Storm",
    manaCost: 15,
    getDesc: (multiplier) => {
        const base = 200;
        const calculated = base * multiplier;
        return `Summon a lightning storm, dealing ${calculated}% of attack as damage to a all enemies.`
    }
}