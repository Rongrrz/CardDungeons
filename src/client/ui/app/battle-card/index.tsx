import React, { ReactNode, useBinding, useState } from "@rbxts/react";
import { cards } from "shared/data/cards";
import { BattleCard } from "./battle-card";
import { ClientCard } from "shared/data/cards/types";

type CardViewportProps = {
	cards: Array<ClientCard>;
};

export function CardViewport(props: CardViewportProps): ReactNode {
	const [tooltip, setTooltip] = useBinding<string>("");
	const [itemIndex, setItemIndex] = useBinding<number>(-1);

	return (
		<>
			<textlabel
				AnchorPoint={new Vector2(0.5, 1)}
				Size={UDim2.fromScale(0.5, 0.1)}
				Position={new UDim2(0.5, 0, 0.8, -15)}
				Text={tooltip}
				TextWrapped={true}
				TextYAlignment={"Bottom"}
				BorderSizePixel={0}
				BackgroundTransparency={1}
			/>

			<frame
				Transparency={0.9}
				Size={UDim2.fromScale(0.5, 0.2)}
				AnchorPoint={new Vector2(0.5, 1)}
				Position={new UDim2(0.5, 0, 1, -5)}
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
								setTooltip(text);
								setItemIndex(index);
							}}
							onHoverExit={() => {
								if (itemIndex.getValue() === index) setTooltip("");
							}}
						/>
					);
				})}
			</frame>
		</>
	);
}
