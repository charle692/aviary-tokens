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
    return fileHeader({ file }) + colorDocumentationFormatter(dictionary, false);
  },
});
