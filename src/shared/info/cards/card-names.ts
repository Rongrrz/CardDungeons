const cardNames = [
    "fireball",
    "lightningStorm"
] as const;

export type CardName = (typeof cardNames)[number];