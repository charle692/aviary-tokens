const StyleDictionary = require("style-dictionary").extend("config.json");
const ChangeCase = require("change-case");

function isStringPxValue(token) {
  if (typeof token.value === "string") {
    return token.value.endsWith("px");
  }
}

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
    return ChangeCase.camelCase(token.path.slice(1).join(""));
  },
});

StyleDictionary.registerTransform({
  name: "name/remove-shades-prefix",
  type: "name",
  matcher: (token) => token.type === "color" && token.path.includes("shades"),
  transformer: function (token) {
    return ChangeCase.camelCase(token.path.slice(2).join(""));
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

StyleDictionary.registerTransformGroup({
  name: "custom/aviary",
  transforms: [
    "attribute/cti",
    "name/remove-color-prefix",
    "name/remove-desktop-prefix",
    "name/remove-shades-prefix",
  ],
});

StyleDictionary.registerTransformGroup({
  name: "custom/native",
  transforms: [
    "attribute/cti",
    "name/remove-color-prefix",
    "name/remove-desktop-prefix",
    "name/remove-shades-prefix",
    "value/rm-px",
  ],
});

StyleDictionary.extend({
  platforms: {
    Owlery: {
      transformGroup: "custom/aviary",
      buildPath: "build/scss/",
      files: [
        {
          destination: "typography.scss",
          format: "scss/variables",
          filter: "filter-typography",
        },
        {
          destination: "colors.scss",
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
          format: "javascript/module-flat",
          destination: "colors.js",
          filter: {
            type: "color",
          },
        },
        {
          format: "typescript/es6-declarations",
          destination: "colors.d.ts",
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
          format: "javascript/module-flat",
          destination: "colors.js",
          filter: {
            type: "color",
          },
        },
        {
          format: "typescript/es6-declarations",
          destination: "colors.d.ts",
          filter: {
            type: "color",
          },
        },
      ],
    },
  },
}).buildAllPlatforms();
