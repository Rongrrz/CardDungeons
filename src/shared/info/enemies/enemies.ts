import { blueSlimeEnemy } from "./enemy-info/enemy-blueSlime";
import { greenSlimeEnemy } from "./enemy-info/enemy-greenSlime";
import { EnemyName } from "./enemy-names";

export interface EnemyStats {
    hp: number,
    attack: number,
    defense: number
}

export interface EnemyData {
    displayName: string
    defaultStats: EnemyStats
}

export const cards: Record<EnemyName, EnemyData>  = {
    greenSlime: greenSlimeEnemy,
    blueSlime: blueSlimeEnemy
}

