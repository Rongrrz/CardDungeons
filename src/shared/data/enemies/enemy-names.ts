const enemyNames = [
    "greenSlime",
    "blueSlime"
] as const;

export type EnemyName = (typeof enemyNames)[number];