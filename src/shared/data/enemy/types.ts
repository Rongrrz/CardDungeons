export interface EnemyStats {
	hp: number;
	attack: number;
	defense: number;
}

export interface EnemyData {
	displayName: string;
	defaultStats: EnemyStats;
}
