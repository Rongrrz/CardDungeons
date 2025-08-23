const cardNames = ["fireball", "lightningStorm", "empty", "enhance"] as const;

export type CardName = (typeof cardNames)[number];
