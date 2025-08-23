import { CardName } from "./codenames";

export type ServerCard = {
	displayName: string;
	manaCost: number;
	base: number;
	getDesc(quality: number): string;
};

export type ClientCard = {
	card: CardName;
	quality: number; // 80-100
};
