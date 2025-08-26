/* eslint-disable @typescript-eslint/no-explicit-any */
type anyFunction = (...args: unknown[]) => unknown;
type OnceFunction<F extends anyFunction> = (...args: Parameters<F>) => ReturnType<F>;

export function once<C extends anyFunction>(callback: C): OnceFunction<C> {
	let called = false;
	let callbackResult: ReturnType<C>;
	return (...args) => {
		if (called !== true) {
			called = true;
			callbackResult = callback(...args) as ReturnType<C>;
		}
		return callbackResult;
	};
}
