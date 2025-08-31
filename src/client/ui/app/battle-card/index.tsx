import React, { ReactNode, useBinding, useEffect, useState } from "@rbxts/react";
import { cards } from "shared/data/cards";
import { BattleCard } from "./battle-card";
import { ClientCard } from "shared/data/cards/types";
import { useMotion } from "@rbxts/pretty-react-hooks";

type CardViewportProps = {
	cards: Array<ClientCard>;
	in: boolean;
};

const inPosition = new UDim2(0.5, 0, 1, -5);
const outPosition = UDim2.fromScale(0.5, 1.2);

export function CardViewport(props: CardViewportProps): ReactNode {
	const [tooltip, setTooltip] = useState<string>("");
	const [framePos, framePosMotion] = useMotion(outPosition);

	useEffect(() => {
		const frameUDim2 = props.in ? inPosition : outPosition;
		framePosMotion.spring(frameUDim2);
	}, [props.in]);

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
							cardSlot={index}
						/>
					);
				})}
			</frame>
		</>
	);
}
