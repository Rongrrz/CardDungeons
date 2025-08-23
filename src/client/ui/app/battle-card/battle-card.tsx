import { useMotion } from "@rbxts/pretty-react-hooks";
import React, { ReactNode, useEffect, useState } from "@rbxts/react";
import { cards } from "shared/data/cards";
import { ClientCard } from "shared/data/cards/types";

type BattleCardProps = ClientCard & {
	onHoverEnter: () => void;
	onHoverExit: () => void;
};

export function BattleCard(props: BattleCardProps): ReactNode {
	const [strokeThickness, strokeThicknessMotion] = useMotion(0);
	const [btnPosition, btnPositionMotion] = useMotion(UDim2.fromScale(0, 1));
	const [hover, setHover] = useState(false);
	const [clicked, setClicked] = useState(false);

	useEffect(() => {
		const thickness = hover ? 1.5 : 0;
		strokeThicknessMotion.immediate(thickness);
	}, [hover]);

	useEffect(() => {
		const position = clicked ? new UDim2(0, 0, 1, -5) : UDim2.fromScale(0, 1);
		btnPositionMotion.spring(position);
	}, [clicked]);

	return (
		<frame Transparency={1} Size={UDim2.fromScale(1, 1)}>
			<uiaspectratioconstraint AspectRatio={0.75} />
			<textbutton
				Event={{
					MouseEnter: () => {
						setHover(true);
						props.onHoverEnter();
					},
					MouseLeave: () => {
						setHover(false);
						props.onHoverExit();
					},
					MouseButton1Click: () => setClicked(!clicked),
				}}
				AutoButtonColor={false}
				TextScaled={true}
				Text={`C: ${cards[props.card].displayName}\nQ: ${props.quality}`}
				BorderSizePixel={0}
				AnchorPoint={new Vector2(0, 1)}
				Position={btnPosition}
				Size={UDim2.fromScale(1, 1)}
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
