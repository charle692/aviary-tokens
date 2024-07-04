// NOTE!
// If you change this file, make sure to copy the resulting content of dist/types/themes.js and dist/types/themes.d.ts
// and replace the contents to themes.js and the themes.d.ts in the root directory
// You will need to update any import/require paths to be relative to the root directory
// Do it! Upon pain of broken pipelines
import * as light from "../../dist/tokens/ts/themes/light";
import * as lightDS3 from "../../dist/tokens/ts/themes/lightDS3";
import * as dark from "../../dist/tokens/ts/themes/dark";
import * as emerson from "../../dist/tokens/ts/themes/emerson";

type AviaryTheme = typeof light;

export { dark, light, emerson, lightDS3 };
export type { AviaryTheme };
