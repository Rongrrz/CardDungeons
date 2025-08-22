import { CardData } from "../cards";

export const fireballCard: CardData = {
    displayName: "Fireball",
    manaCost: 5,
    getDesc: (multiplier) => {
        const base = 180
        const calculated = base * multiplier
        return `Cast a fireball spell towards a single-target, dealing ${calculated}% of attack as damage.`
    }
}