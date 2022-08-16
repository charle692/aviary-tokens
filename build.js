const StyleDictionary = require("style-dictionary");
const ChangeCase = require("change-case");
const { fileHeader, getTypeScriptType } = StyleDictionary.formatHelpers;

const isStringPxValue = (token) => {
  if (typeof token.value === "string") {
    return token.value.endsWith("px");
  }
};

StyleDictionary.registerFilter({
  name: "filter-typography",
  matcher: function (token) {
    return token.attributes.category === "typography";
  },
});

StyleDictionary.registerTransform({
  name: "name/remove-desktop-prefix",
  type: "name",
  transformer: function (token) {
    const slicePrefix = token.path.slice(1);
    const filterDesktop = slicePrefix.filter((prefix) => prefix !== "desktop");
    return ChangeCase.camelCase(filterDesktop.join(" ")).replace("_", "");
  },
});

StyleDictionary.registerTransform({
  name: "name/remove-color-prefix",
  matcher: (token) => token.type === "color",
  type: "name",
  transformer: function (token) {
    return ChangeCase.camelCase(token.path.slice(2).join(" "));
  },
});

StyleDictionary.registerTransform({
  name: "value/rm-px",
  type: "value",
  matcher: isStringPxValue,
  transformer: function (token) {
    return parseFloat(token.value);
  },
});

const customColorObjectFormatter = (dictionary, isJS) => {
  const valueOrType = (token) =>
    isJS ? `"${token.value}"` : `${getTypeScriptType(token.value)}`;
  const declaration = isJS ? "" : `export const `;
  const commaOrColon = isJS ? `,` : `;`;

  return Object.entries(dictionary.properties.colors)
    .map((tokens) => {
      const colorObj = tokens[0];
      const filteredTokens = dictionary.allTokens.filter(
        (token) => token.attributes.type === colorObj
      );

      return (
        declaration +
        `${colorObj} : {` +
        filteredTokens.map((token) => {
          return `${token.name} : ` + valueOrType(token);
        }) +
        `}${commaOrColon}`
      );
    })
    .join(`\n`);
};

StyleDictionary.registerFormat({
  name: "custom/typescript-color-declaration",
  formatter: ({ dictionary, file }) => {
    return fileHeader({ file }) + customColorObjectFormatter(dictionary, false);
  },
});

StyleDictionary.registerFormat({
  name: "custom/javascript-colors",
  formatter: ({ dictionary, file }) => {
    return (
      fileHeader({ file }) +
      `module.exports = {` +
      customColorObjectFormatter(dictionary, true) +
      `};`
    );
  },
});

StyleDictionary.registerTransformGroup({
  name: "custom/aviary",
  transforms: [
    "attribute/cti",
    "name/remove-desktop-prefix",
    "name/remove-color-prefix",
  ],
});

StyleDictionary.registerTransformGroup({
  name: "custom/native",
  transforms: [
    "attribute/cti",
    "name/remove-desktop-prefix",
    "value/rm-px",
    "name/remove-color-prefix",
  ],
});

StyleDictionary.registerTransformGroup({
  name: "custom/owlery",
  transforms: ["attribute/cti", "name/remove-desktop-prefix"],
});

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
            filter: "filter-typography",
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
            filter: "filter-typography",
          },
          {
            format: "typescript/es6-declarations",
            destination: "typography.d.ts",
            filter: "filter-typography",
          },
          {
            format: "custom/javascript-colors",
            destination: core ? "colors.js" : `themes/${theme}.js`,
            filter: {
              type: "color",
            },
          },
          {
            format: "custom/typescript-color-declaration",
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
            filter: "filter-typography",
          },
          {
            format: "typescript/es6-declarations",
            destination: "typography.d.ts",
            filter: "filter-typography",
          },
          {
            format: "custom/javascript-colors",
            destination: core ? "colors.js" : `themes/${theme}.js`,
            filter: {
              type: "color",
            },
          },
          {
            format: "custom/typescript-color-declaration",
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
