import { useMotion } from "@rbxts/pretty-react-hooks";
import React, { ReactNode, useEffect } from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { selectedCardSlotAtom } from "client/atoms/battle-inputting";
import { cards } from "shared/data/cards";
import { ClientCard } from "shared/data/cards/types";

type BattleCardProps = ClientCard & {
	onHoverStart: () => void;
	onHoverEnd: () => void;
	cardSlot: number;
};

export function BattleCard(props: BattleCardProps): ReactNode {
	const [stroke, strokeMotion] = useMotion(0);
	const [cardColor, cardColorMotion] = useMotion(Color3.fromRGB(255, 255, 255));
	const selectedCardSlot = useAtom(selectedCardSlotAtom);

	useEffect(() => {
		const using = selectedCardSlot === props.cardSlot;
		const goal = using ? Color3.fromRGB(255, 200, 200) : Color3.fromRGB(255, 255, 255);
		cardColorMotion.spring(goal);
	}, [selectedCardSlot]);

	const displayName = cards[props.card].displayName;

	return (
		<frame Transparency={1} Size={UDim2.fromScale(1, 1)}>
			<uiaspectratioconstraint AspectRatio={0.75} />
			<textbutton
				Event={{
					MouseEnter: () => {
						strokeMotion.immediate(3);
						props.onHoverStart();
					},
					MouseLeave: () => {
						strokeMotion.immediate(0);
						props.onHoverEnd();
					},
					MouseButton1Click: () => {
						selectedCardSlotAtom((current) =>
							current === props.cardSlot ? undefined : props.cardSlot,
						);
					},
				}}
				BackgroundColor3={cardColor}
				AutoButtonColor={false}
				TextScaled={true}
				Text={`C: ${displayName}\nQ: ${props.quality}`}
				BorderSizePixel={0}
				AnchorPoint={new Vector2(0, 1)}
				Position={UDim2.fromScale(0, 1)}
				Size={UDim2.fromScale(1, 1)}
				Transparency={0}
			>
				<uistroke
					Color={Color3.fromRGB(255, 255, 255)}
					Thickness={stroke}
					ApplyStrokeMode={"Border"}
				>
					<uigradient
						Color={
							new ColorSequence(
								Color3.fromRGB(255, 100, 100),
								Color3.fromRGB(255, 180, 0),
							)
						}
					/>
				</uistroke>
			</textbutton>
		</frame>
	);
}
