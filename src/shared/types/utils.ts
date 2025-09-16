export type StrictUnion<A, B> =
	| (A & { [K in Exclude<keyof B, keyof A>]?: never })
	| (B & { [K in Exclude<keyof A, keyof B>]?: never });

export type ModelName = Extract<keyof Omit<ReplicatedStorage["Models"], keyof Folder>, string>;

export type EmptyObject = Record<string, never>;
