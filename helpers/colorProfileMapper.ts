import type { AviaryTheme } from "../themes";

export const colorProfileMapper = (currentTheme: AviaryTheme) => {
  return {
    primary: currentTheme.primary,
    info: currentTheme.info,
    warning: currentTheme.warning,
    danger: currentTheme.danger,
    highlight: currentTheme.highlight,
  };
};
