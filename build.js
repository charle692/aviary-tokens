const StyleDictionary = require("style-dictionary").extend("config.json");

StyleDictionary.registerFilter({
  name: "filter-typography",
  matcher: function(token){
    return token.attributes.category === "typography";
  },
});

StyleDictionary.registerTransform({
  name: 'name/slice-path',
  type: 'name',
  transformer: function(token) {
      return token.path.slice(1).join("");
  }
});

StyleDictionary.registerTransformGroup({
  name: 'custom/aviary',
  transforms: ['name/slice-path', 'attribute/cti']
});

StyleDictionary.extend({
  platforms: {
    Owlery: {
      transformGroup: "custom/aviary",
      buildPath: "build/scss/",
      files: [
        {
          destination: "colors.scss",
          format: "scss/variables",
          filter: {
            type: "color",
          },
        },
        {
          destination: "typography.scss",
          format: "scss/variables",
          filter: "filter-typography",
        },
      ],
    },

    Aviary: {
      transformGroup: "custom/aviary",
      buildPath: "build/ts/",
      files: [
        {
          format: "javascript/es6",
          destination: "colors.ts",
          filter: {
            type: "color",
          },
        },
        {
          format: "javascript/es6",
          destination: "typography.ts",
          filter: "filter-typography",
        },
      ],
    },
  },
}).buildAllPlatforms();
