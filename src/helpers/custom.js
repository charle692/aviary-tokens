const StyleDictionary = require("style-dictionary");
const ChangeCase = require("change-case");
const tinycolor = require("tinycolor2");
const { fileHeader, getTypeScriptType } = StyleDictionary.formatHelpers;

// FILTERS
StyleDictionary.registerFilter({
  name: "custom/filter/typography",
  matcher: function (token) {
    return token.attributes.category === "typography";
  },
});

StyleDictionary.registerFilter({
  name: "custom/filter/borders",
  matcher: (token) => {
    return (
      token.attributes.category === "borderRadius" ||
      token.attributes.category === "border"
    );
  },
});

StyleDictionary.registerFilter({
  name: "custom/filter/themeTokens",
  matcher: (token) => {
    return (
      token.attributes.category === "shadows" ||
      token.attributes.category === "colors"
    );
  },
});

// TRANSFORMS
const isStringPxValue = (token) => {
  if (typeof token.value === "string") {
    return token.value.endsWith("px");
  }
};

StyleDictionary.registerTransform({
  name: "custom/name/remove-color-prefix",
  matcher: (token) => token.type === "color",
  type: "name",
  transformer: function (token) {
    return ChangeCase.camelCase(token.path.slice(2).join(" "));
  },
});

StyleDictionary.registerTransform({
  name: "custom/name/remove-desktop-prefix",
  type: "name",
  transformer: function (token) {
    const slicePrefix = token.path.slice(1);
    const filterDesktop = slicePrefix.filter((prefix) => prefix !== "desktop");
    return ChangeCase.camelCase(filterDesktop.join(" ")).replace("_", "");
  },
});

StyleDictionary.registerTransform({
  name: "custom/value/box-shadows",
  type: "value",
  matcher: function (token) {
    return token.attributes.category === "shadows";
  },
  transformer: function (token) {
    // destructure shadow values from original token value
    const { x, y, blur, spread, color, alpha } = token.original.value;

    // convert hex code to rgba string
    const shadowColor = tinycolor(color);
    shadowColor.setAlpha(alpha);
    shadowColor.toRgbString();

    return `${x}px ${y}px ${blur}px ${spread}px ${shadowColor}`;
  },
});

StyleDictionary.registerTransform({
  name: "custom/value/rm-px",
  type: "value",
  matcher: isStringPxValue,
  transformer: function (token) {
    return parseFloat(token.value);
  },
});

StyleDictionary.registerTransform({
  name: "custom/value/font-weight-to-string",
  type: "value",
  matcher: (token) =>
    token.type === "fontWeights" || token.type === "fontWeight",
  transformer: function (token) {
    return token.value.toString();
  },
});

// FORMATTERS
const declaration = (isJS) => (isJS ? "" : `export const `);
const commaOrColon = (isJS) => (isJS ? `,` : `;`);
const valueOrType = (token, isJS) =>
  isJS ? `"${token.value}"` : `${getTypeScriptType(token.value)}`;

const customColorObjectFormatter = (dictionary, theme, isJS) => {
  let prefix = ``;
  // Only add a prefix for theme files, not core ones
  if (!theme?.destination.includes("core")) {
    const themeWithSlash = theme.destination.substring(
      0,
      theme.destination.indexOf(".")
    );
    const extractedThemeName = { value: themeWithSlash.split("/")[1] };
    prefix = `${declaration(isJS)}theme: ${valueOrType(
      extractedThemeName,
      isJS
    )}${commaOrColon(isJS)}\n`;
  }

  return (
    prefix +
    Object.entries(dictionary.properties.colors)
      .map((tokens) => {
        const colorObj = tokens[0];
        const filteredTokens = dictionary.allTokens.filter(
          (token) => token.attributes.type === colorObj
        );

        return (
          declaration(isJS) +
          `${colorObj} : {` +
          filteredTokens.map((token) => {
            return `${token.name} : ` + valueOrType(token, isJS);
          }) +
          `}${commaOrColon(isJS)}`
        );
      })
      .join(`\n`)
  );
};

const customBoxShadowObjectFormatter = (dictionary) => {
  console.log(dictionary.properties.shadows);
  // format and flatten these into one line
  // can we use the custom transform above?
  // look into TS files
  // yeet emerson box shadow tokens
// {
//   card: {
//     base: {
//       x: [Object],
//       y: [Object],
//       blur: [Object],
//       spread: [Object],
//       color: [Object],
//       type: [Object]
//     },
//     hover: {
//       x: [Object],
//       y: [Object],
//       blur: [Object],
//       spread: [Object],
//       color: [Object],
//       type: [Object]
//     }
//   },
//   popover: {
//     base: {
//       x: [Object],
//       y: [Object],
//       blur: [Object],
//       spread: [Object],
//       color: [Object],
//       type: [Object]
//     }
//   },
//   modal: {
//     base: {
//       x: [Object],
//       y: [Object],
//       blur: [Object],
//       spread: [Object],
//       color: [Object],
//       type: [Object]
//     }
//   }
// }
  return dictionary.properties.shadows;
};

StyleDictionary.registerFormat({
  name: "custom/format/typescript-color-declarations",
  formatter: ({ dictionary, file }) => {
    return (
      fileHeader({ file }) + customColorObjectFormatter(dictionary, file, false)
    );
  },
});

StyleDictionary.registerFormat({
  name: "custom/format/javascript-colors",
  formatter: ({ dictionary, file }) => {
    return (
      fileHeader({ file }) +
      `module.exports = {` +
      customBoxShadowObjectFormatter(dictionary) +
      customColorObjectFormatter(dictionary, file, true) +
      `};`
    );
  },
});

const colorDocumentationFormatter = (dictionary, isJS) => {
  const renderDescription = (desc) => {
    if (desc) {
      return isJS ? `description: "${desc}"` : `description: string`;
    }
    return "";
  };

  return Object.entries(dictionary.properties.colors)
    .map((tokens) => {
      const colorObj = tokens[0];
      const filteredTokens = dictionary.allTokens.filter(
        (token) => token.attributes.type === colorObj
      );

      return (
        declaration(isJS) +
        `${colorObj} : {` +
        filteredTokens.map((token) => {
          return `${token.name}:{
            name: ${isJS ? `"${colorObj}.${token.name}"` : `string`},
            hex: ${valueOrType(token, isJS)},
            ${renderDescription(token.description)}
          }`;
        }) +
        `}${commaOrColon(isJS)}`
      );
    })
    .join(`\n`);
};

StyleDictionary.registerFormat({
  name: "custom/format/javascript-colors-documentation",
  formatter: ({ dictionary, file }) => {
    return (
      fileHeader({ file }) +
      `module.exports = {` +
      colorDocumentationFormatter(dictionary, true) +
      `};`
    );
  },
});

StyleDictionary.registerFormat({
  name: "custom/format/typescript-color-declarations-documentation",
  formatter: ({ dictionary, file }) => {
    return (
      fileHeader({ file }) + colorDocumentationFormatter(dictionary, false)
    );
  },
});

// GROUPS
StyleDictionary.registerTransformGroup({
  name: "custom/aviary",
  transforms: [
    "attribute/cti",
    "custom/name/remove-desktop-prefix",
    "custom/name/remove-color-prefix",
    "custom/value/box-shadows",
  ],
});

StyleDictionary.registerTransformGroup({
  name: "custom/documentation",
  transforms: [
    "attribute/cti",
    "custom/name/remove-desktop-prefix",
    "custom/name/remove-color-prefix",
  ],
});

StyleDictionary.registerTransformGroup({
  name: "custom/native",
  transforms: [
    "attribute/cti",
    "custom/name/remove-desktop-prefix",
    "custom/value/rm-px",
    "custom/value/font-weight-to-string",
    "custom/name/remove-color-prefix",
  ],
});

StyleDictionary.registerTransformGroup({
  name: "custom/scss",
  transforms: [
    "attribute/cti",
    "custom/name/remove-desktop-prefix",
    "custom/value/box-shadows",
  ],
});
