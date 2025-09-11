// Note that for the player side of things there shall NEVER be adjacency
export enum CardTargetType {
	User,
	SingleUserTeam,
	SingleEnemy,

	AllUserTeam,
	AllEnemyTeam,

	None,

	// TODO: Integrate later/when needed
	// All,
	// SingleAnyTeam,
	// SingleEnemyAndAdjacent,
	// SingleUserTeamExceptUser,
	// AllUserTeamExceptUser,
	// AllButUser,
}

export function isTargetingAll(t: CardTargetType): boolean {
	return t === CardTargetType.AllUserTeam || t === CardTargetType.AllEnemyTeam;
}
