/**
 * used in build.js
 *
 * Formats define the output of your created files
 * order of operations: filters > transforms > formats
 *
 * https://amzn.github.io/style-dictionary/#/formats
 */

const StyleDictionary = require("style-dictionary");
const { fileHeader, getTypeScriptType } = StyleDictionary.formatHelpers;

const declaration = (isJS) => (isJS ? "" : `export const `);
const commaOrColon = (isJS) => (isJS ? `,` : `;`);
const valueOrType = (token, isJS) =>
  isJS ? `"${token.value}"` : `${getTypeScriptType(token.value)}`;

const addPrefix = (theme, isJS) => {
  // Only add a prefix for theme files, not core ones
  if (theme?.destination.includes("core")) return ``;

  const themeWithSlash = theme.destination.substring(
    0,
    theme.destination.indexOf(".")
  );
  const extractedThemeName = { value: themeWithSlash.split("/")[1] };
  return (prefix = `${declaration(isJS)}theme: ${valueOrType(
    extractedThemeName,
    isJS
  )}${commaOrColon(isJS)}\n`);
};

const renderOutput = (isJS, tokenFamily, tokensArray, customValueOrType) => {
  const renderValueOrType = (token) =>
    customValueOrType
      ? customValueOrType(token, isJS)
      : valueOrType(token, isJS);

  return (
    declaration(isJS) +
    `${tokenFamily} : {` +
    tokensArray.map((token) => {
      return `${token.name} : ` + renderValueOrType(token);
    }) +
    `}${commaOrColon(isJS)}`
  );
};

const customBaseColorObjectFormatter = (dictionary, isJS) => {
  return Object.entries(dictionary.properties.colors)
    .filter((tokens) => tokens[0] !== "accent")
    .map((tokens) => {
      const colorObj = tokens[0];
      const filteredTokens = dictionary.allTokens.filter(
        (token) => token.attributes.type === colorObj
      );

      return renderOutput(isJS, colorObj, filteredTokens);
    })
    .join(`\n`);
};

const customAccentColorObjectFormatter = (dictionary, isJS) => {
  return Object.entries(dictionary.properties.colors)
    .filter((tokens) => tokens[0] === "accent")
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
    .join(`\n`);
};

const customBoxShadowObjectFormatter = (dictionary, theme, isJS) => {
  // no box shadow tokens for core, returns empty object otherwise
  if (theme?.destination.includes("core")) return "";

  const boxShadows = dictionary.allTokens.filter(
    (token) => token.attributes.category === "boxShadows"
  );
  const valueOrType = (token, isJS) => {
    return isJS
      ? `"${token.value.x}px ${token.value.y}px ${token.value.blur}px ${token.value.spread}px ${token.value.color}"`
      : `string`;
  };

  return renderOutput(isJS, "boxShadows", boxShadows, valueOrType);
};

const customOpacityObjectFormatter = (dictionary, theme, isJS) => {
  // no opacity tokens for core, returns empty object otherwise
  if (theme?.destination.includes("core")) return "";

  const opacityTokens = dictionary.allTokens.filter(
    (token) => token.attributes.category === "opacity"
  );
  const valueOrType = (token, isJS) => {
    return isJS ? `${token.value}` : `number`;
  };

  return renderOutput(isJS, "opacity", opacityTokens, valueOrType);
};

StyleDictionary.registerFormat({
  name: "custom/format/typescript-color-declarations",
  formatter: ({ dictionary, file }) => {
    return (
      fileHeader({ file }) +
      addPrefix(file, false) +
      customBaseColorObjectFormatter(dictionary, false) +
      customAccentColorObjectFormatter(dictionary, false) +
      customBoxShadowObjectFormatter(dictionary, file, false) +
      customOpacityObjectFormatter(dictionary, file, false)
    );
  },
});

StyleDictionary.registerFormat({
  name: "custom/format/javascript-colors",
  formatter: ({ dictionary, file }) => {
    return (
      fileHeader({ file }) +
      `module.exports = {` +
      addPrefix(file, true) +
      customBaseColorObjectFormatter(dictionary, true) +
      customAccentColorObjectFormatter(dictionary, true) +
      customBoxShadowObjectFormatter(dictionary, file, true) +
      customOpacityObjectFormatter(dictionary, file, true) +
      `};`
    );
  },
});
