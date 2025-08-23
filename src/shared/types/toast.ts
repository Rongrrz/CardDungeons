import { Color } from "./color";

export type ToastRequest = {
	message: string;
	color: Color;
};

export type ToastEntry = ToastRequest & {
	id: number;
};
