export const cardCodenames = ["fireball", "lightningStorm", "enhance"] as const;

export type CardName = (typeof cardCodenames)[number];
