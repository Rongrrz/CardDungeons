import React, { ReactNode, useEffect, useState } from "@rbxts/react";
import { cards } from "shared/data/cards";
import { BattleCard } from "./card";
import { useMotion } from "@rbxts/pretty-react-hooks";
import { useAtom } from "@rbxts/react-charm";
import { isCardContainerIn, playerHand } from "client/atoms/battle-inputting";
import { ReplicatedStorage } from "@rbxts/services";

const inPosition = new UDim2(0.5, 0, 1, -5);
const outPosition = UDim2.fromScale(0.5, 1.2);

export function CardContainer(): ReactNode {
	const [tooltip, setTooltip] = useState<string>("");
	const [framePos, framePosMotion] = useMotion(outPosition);
	const hand = useAtom(playerHand);
	const isIn = useAtom(isCardContainerIn);

	useEffect(() => {
		const frameUDim2 = isIn ? inPosition : outPosition;
		framePosMotion.spring(frameUDim2);
	}, [isIn]);

	// TODO: Make tooltip follow mouse, and original tooltip position for submit and undo
	// TODO: Make GUI to show input order
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

			<textbutton
				BackgroundColor3={Color3.fromRGB(150, 255, 255)}
				Size={UDim2.fromScale(0.1, 0.05)}
				Transparency={0}
				Position={new UDim2(0.2, -5, 0.8625, 2)}
				BorderSizePixel={0}
				AnchorPoint={new Vector2(0.5, 1)}
				Text={"End Turn"}
				Event={{ MouseButton1Click: () => ReplicatedStorage.Remotes.EndTurnClicked.Fire() }}
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
							key={`${card.card}-${card.quality}`}
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
