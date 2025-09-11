export const enemyCodenames = ["greenSlime", "blueSlime"] as const;

export type EnemyName = (typeof enemyCodenames)[number];
