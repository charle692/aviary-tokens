import type * as light from "../build/ts/themes/light";

type StandardColorsProfileTheme = typeof light.primary;
type SystemColorProfileTheme = typeof light.system;

type ColorProfileTheme = StandardColorsProfileTheme | SystemColorProfileTheme;

export type { ColorProfileTheme };
