export const cardCodenames = ["fireball", "lightningStorm", "empty", "enhance"] as const;

export type CardName = (typeof cardCodenames)[number];
