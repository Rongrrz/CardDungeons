import { useContext } from "@rbxts/react";
import { FadetimeContext } from "client/ui/components/archived/contexts/fadetime-context";

export function useFadetime(): number {
	const context = useContext(FadetimeContext);
	assert(context, "Fadetime Provider type stuff");
	return context;
}
