import React, { ReactNode, useEffect, useState } from "@rbxts/react";
import { cards } from "shared/data/cards";
import { BattleCard } from "./battle-card";
import { useMotion } from "@rbxts/pretty-react-hooks";
import { useAtom } from "@rbxts/react-charm";
import { cardContainerCards, isCardContainerIn } from "client/atoms/battle-inputting";

const inPosition = new UDim2(0.5, 0, 1, -5);
const outPosition = UDim2.fromScale(0.5, 1.2);

export function CardContainer(): ReactNode {
	const [tooltip, setTooltip] = useState<string>("");
	const [framePos, framePosMotion] = useMotion(outPosition);
	const hand = useAtom(cardContainerCards);
	const isIn = useAtom(isCardContainerIn);

	useEffect(() => {
		const frameUDim2 = isIn ? inPosition : outPosition;
		framePosMotion.spring(frameUDim2);
	}, [isIn]);

	return (
		<>
			<textlabel
				AnchorPoint={new Vector2(0.5, 1)}
				Size={UDim2.fromScale(0.5, 0.06)}
				Position={new UDim2(0.5, 0, 0.8, -15)}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={tooltip}
				TextScaled={true}
				TextWrapped={true}
				TextYAlignment={"Bottom"}
				BorderSizePixel={0}
				BackgroundTransparency={1}
			/>

			<frame
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				Transparency={0.5}
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

				{hand.map((card, index) => {
					return (
						<BattleCard
							key={`${index}`}
							card={card.card}
							quality={card.quality}
							onHoverStart={() => {
								const text = cards[card.card].getDesc(card.quality);
								task.delay(0, () => setTooltip(text));
							}}
							onHoverEnd={() => setTooltip("")}
							cardSlot={index}
						/>
					);
				})}
			</frame>
		</>
	);
}
