import React from "@rbxts/react";
import { PropsWithChildren, ReactNode } from "@rbxts/react";
import { FadetimeContext } from "client/ui/components/contexts/fadetime-context";

export function FadetimeProvider({ children }: PropsWithChildren): ReactNode {
	return <FadetimeContext.Provider value={0.5}>{children}</FadetimeContext.Provider>;
}
