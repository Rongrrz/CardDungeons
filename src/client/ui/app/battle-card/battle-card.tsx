import { useMotion } from "@rbxts/pretty-react-hooks";
import React, { ReactNode, useEffect, useState } from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { usingCardSlotAtom } from "client/atoms/battle-inputting";
import { cards } from "shared/data/cards";
import { ClientCard } from "shared/data/cards/types";

type BattleCardProps = ClientCard & {
	onHoverEnter: () => void;
	onHoverExit: () => void;
	cardSlot: number;
};

export function BattleCard(props: BattleCardProps): ReactNode {
	const [strokeThickness, strokeThicknessMotion] = useMotion(0);
	const [cardTransparency, cardTransparencyMotion] = useMotion(0);
	const [hover, setHover] = useState(false);
	const usingCardSlot = useAtom(usingCardSlotAtom);

	useEffect(() => {
		const thickness = hover ? 1.5 : 0;
		strokeThicknessMotion.immediate(thickness);
	}, [hover]);

	useEffect(() => {
		if (usingCardSlot === undefined) {
			cardTransparencyMotion.spring(0);
			return;
		}
		const using = usingCardSlot === props.cardSlot;

		// If not using, then button becomes less transparent
		const transparency = using ? 0 : 0.75;
		cardTransparencyMotion.spring(transparency);
	}, [usingCardSlot]);

	return (
		<frame Transparency={1} Size={UDim2.fromScale(1, 1)}>
			<uiaspectratioconstraint AspectRatio={0.75} />
			<textbutton
				Event={{
					MouseEnter: () => {
						if (usingCardSlot !== undefined) return;
						setHover(true);
						props.onHoverEnter();
					},
					MouseLeave: () => {
						if (usingCardSlot !== undefined) return;
						setHover(false);
						props.onHoverExit();
					},
					MouseButton1Click: () => {
						// Unselect if already selected
						if (usingCardSlot === props.cardSlot) {
							usingCardSlotAtom(undefined);
						}

						// We won't continue if another card had already been selected
						if (usingCardSlot !== undefined) return;

						// We can select our card
						usingCardSlotAtom(props.cardSlot);
					},
				}}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				AutoButtonColor={false}
				TextScaled={true}
				Text={`C: ${cards[props.card].displayName}\nQ: ${props.quality}`}
				BorderSizePixel={0}
				AnchorPoint={new Vector2(0, 1)}
				Position={UDim2.fromScale(0, 1)}
				Size={UDim2.fromScale(1, 1)}
				Transparency={cardTransparency}
			>
				<uistroke
					Color={Color3.fromRGB(0, 0, 0)}
					Thickness={strokeThickness}
					ApplyStrokeMode={"Border"}
				/>
			</textbutton>
		</frame>
	);
}
