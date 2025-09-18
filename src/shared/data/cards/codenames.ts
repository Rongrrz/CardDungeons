export const cardCodenames = ["fireball", "lightningStorm", "enhance", "tripleAttack"] as const;

export type CardName = (typeof cardCodenames)[number];
