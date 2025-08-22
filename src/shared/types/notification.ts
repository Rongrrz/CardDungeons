import { Color } from "./color";

export type ServerToast = {
	message: string;
	color: Color;
};

export type ClientToast = ServerToast & {
	id: number;
};
