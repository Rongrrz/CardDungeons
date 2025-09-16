export type Color = "Green" | "Blue" | "Pink" | "Orange" | "Red";

export const presetColors: Record<Color, Color3> = {
	Green: Color3.fromRGB(100, 200, 100),
	Blue: Color3.fromRGB(100, 200, 255),
	Pink: Color3.fromRGB(255, 220, 220),
	Orange: Color3.fromRGB(255, 200, 60),
	Red: Color3.fromRGB(255, 80, 80),
};

export function getColor3(color: Color): Color3 {
	return presetColors[color];
}
