/**
 * A non-biased, O(n) shuffling algorithm
 * @param original - The original array
 * @returns - A shallow-copy of the original array, shuffled
 */
export function knuthShuffle<T>(original: ReadonlyArray<T>): Array<T> {
	const result = [...original];
	for (let i = result.size() - 1; i > 0; i--) {
		const j = math.random(0, i);
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

/**
 * A non-biased, O(n) shuffling algorithm
 * @param array - The array to shuffle
 */
export function knuthShuffleInPlace<T>(array: Array<T>) {
	for (let i = array.size() - 1; i > 0; i--) {
		const j = math.random(0, i);
		[array[i], array[j]] = [array[j], array[i]];
	}
}
