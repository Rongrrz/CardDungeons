export type StrictUnion<A, B> =
	| (A & { [K in Exclude<keyof B, keyof A>]?: never })
	| (B & { [K in Exclude<keyof A, keyof B>]?: never });

export type EmptyObject = Record<string, never>;
