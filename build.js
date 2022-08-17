import StyleDictionary from "style-dictionary";

import "./helpers/custom.js";

const getStyleDictionaryConfig = (theme) => {
  const core = theme === "core";
  return {
    source: [`transformed/transformed-${theme}.json`],
    platforms: {
      Owlery: {
        transformGroup: "custom/owlery",
        buildPath: "build/scss/",
        files: [
          {
            destination: `typography.scss`,
            format: "scss/variables",
            filter: "custom/filter/typography",
          },
          {
            destination: core ? "colors.scss" : `themes/${theme}.scss`,
            format: "scss/variables",
            filter: {
              type: "color",
            },
          },
        ],
      },

      Aviary: {
        transformGroup: "custom/aviary",
        buildPath: "build/ts/",
        files: [
          {
            format: "javascript/module-flat",
            destination: "typography.js",
            filter: "custom/filter/typography",
          },
          {
            format: "typescript/es6-declarations",
            destination: "typography.d.ts",
            filter: "custom/filter/typography",
          },
          {
            format: "custom/format/javascript-colors",
            destination: core ? "colors.js" : `themes/${theme}.js`,
            filter: {
              type: "color",
            },
          },
          {
            format: "custom/format/typescript-color-declarations",
            destination: core ? "colors.d.ts" : `themes/${theme}.d.ts`,
            filter: {
              type: "color",
            },
          },
        ],
      },

      Native: {
        transformGroup: "custom/native",
        buildPath: "build/native/",
        files: [
          {
            format: "javascript/module-flat",
            destination: "typography.js",
            filter: "custom/filter/typography",
          },
          {
            format: "typescript/es6-declarations",
            destination: "typography.d.ts",
            filter: "custom/filter/typography",
          },
          {
            format: "custom/format/javascript-colors",
            destination: core ? "colors.js" : `themes/${theme}.js`,
            filter: {
              type: "color",
            },
          },
          {
            format: "custom/format/typescript-color-declarations",
            destination: core ? "colors.d.ts" : `themes/${theme}.d.ts`,
            filter: {
              type: "color",
            },
          },
        ],
      },
    },
  };
};

// Add themes to the array to create theme-specific files under themes folder
// "core" theme will build files outside of the themes folder
["core", "light"].map((theme) => {
  StyleDictionary.extend(getStyleDictionaryConfig(theme)).buildAllPlatforms();
});
