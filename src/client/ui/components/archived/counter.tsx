import React, { useState } from "@rbxts/react";

export function Counter() {
	const [number, setNumber] = useState(0);

	return (
		<textbutton
			Event={{
				MouseButton1Click: () => {
					setNumber(number + 1);
				},
			}}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			Size={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Text={`Your beautiful number: ${number}`}
			TextScaled={true}
		></textbutton>
	);
}
