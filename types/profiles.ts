import { primary, system } from "../build/ts/themes/light";

type StandardColorsProfileTheme = typeof primary;
type SystemColorProfileTheme = typeof system;

type ColorProfileTheme = StandardColorsProfileTheme | SystemColorProfileTheme;

export type { ColorProfileTheme };
