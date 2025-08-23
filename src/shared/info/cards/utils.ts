export function calculateMultiplier(base: number, quality: number) {
	return math.floor(base * (quality / 100));
}
