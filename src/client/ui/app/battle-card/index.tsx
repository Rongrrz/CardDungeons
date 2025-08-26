import React, { ReactNode, useBinding, useEffect } from "@rbxts/react";
import { cards } from "shared/data/cards";
import { BattleCard } from "./battle-card";
import { ClientCard } from "shared/data/cards/types";
import { useMotion } from "@rbxts/pretty-react-hooks";
import { useAtom } from "@rbxts/react-charm";
import { inputtingAtom } from "client/atoms/battle-inputting";

type CardViewportProps = {
	cards: Array<ClientCard>;
};

const inPosition = new UDim2(0.5, 0, 1, -5);
const outPosition = UDim2.fromScale(0.5, 1.2);

export function CardViewport(props: CardViewportProps): ReactNode {
	const [tooltip, setTooltip] = useBinding<string>("");
	const [framePos, framePosMotion] = useMotion(outPosition);
	const inputting = useAtom(inputtingAtom);

	useEffect(() => {
		const frameUDim2 = inputting ? inPosition : outPosition;
		framePosMotion.spring(frameUDim2);
	}, [inputting]);

	return (
		<>
			<textlabel
				AnchorPoint={new Vector2(0.5, 1)}
				Size={UDim2.fromScale(0.5, 0.1)}
				Position={new UDim2(0.5, 0, 0.8, -15)}
				Text={tooltip.getValue()}
				TextWrapped={true}
				TextYAlignment={"Bottom"}
				BorderSizePixel={0}
				BackgroundTransparency={1}
			/>

			<frame
				Transparency={0.75}
				BorderSizePixel={0}
				Size={UDim2.fromScale(0.5, 0.2)}
				AnchorPoint={new Vector2(0.5, 1)}
				Position={framePos}
			>
				<uilistlayout
					Padding={new UDim(0, 5)}
					HorizontalAlignment={"Center"}
					FillDirection={"Horizontal"}
					SortOrder={"LayoutOrder"}
				></uilistlayout>

				{props.cards.map((c, index) => {
					return (
						<BattleCard
							key={`${index}`}
							card={c.card}
							quality={c.quality}
							onHoverEnter={() => {
								const text = cards[c.card].getDesc(c.quality);
								task.delay(0, () => setTooltip(text));
							}}
							onHoverExit={() => setTooltip("")}
						/>
					);
				})}
			</frame>
		</>
	);
}
