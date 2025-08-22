import { useInterval, useMotion } from "@rbxts/pretty-react-hooks";
import React, { useEffect, useState } from "@rbxts/react";

// react bindings doesn't affect rerenders
// redenders in react can be costly
// binding values directly to react/react properties can skip rerenders and ignore all hooks
// won't trigger rerenders

// given an array how to render a list
// i would firstly make a new component called a list i guess
// of courses, do all the initialization so like setting up a story and tsx file for it
// pass in an array to be given as props
//

// react children accepts an array of react node
// a react node can be anything (component? tsx?)
// react key?
export function CountdownCounter() {
	const [number, setNumber] = useState(0);
	const [frameSize, frameSizeMotion] = useMotion(UDim2.fromScale(0.5, 0.5));
	const [big, setBig] = useState(false);

	useInterval(() => {
		setNumber(number - 1);
	}, 0.05);

	useEffect(() => {
		if (big) {
			frameSizeMotion.tween(UDim2.fromScale(0.8, 0.8), {
				time: 0.35,
				style: Enum.EasingStyle.Quad,
				direction: Enum.EasingDirection.Out,
			});
		} else {
			frameSizeMotion.tween(UDim2.fromScale(0.5, 0.5), {
				time: 0.35,
				style: Enum.EasingStyle.Quad,
				direction: Enum.EasingDirection.Out,
			});
		}
	}, [big]);

	return (
		<textbutton
			Event={{
				MouseButton1Click: () => {
					setNumber(100);
				},
				MouseEnter: () => {
					setBig(true);
				},
				MouseLeave: () => {
					setBig(false);
				},
			}}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			Size={frameSize}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Text={tostring(number)}
			TextScaled={true}
		>
			{/* {[].map((item) => {})} */}
		</textbutton>
	);
}
