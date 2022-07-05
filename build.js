const StyleDictionary = require("style-dictionary").extend("config.json");
const ChangeCase = require('change-case')

StyleDictionary.registerFilter({
  name: "filter-typography",
  matcher: function(token){
    return token.attributes.category === "typography";
  },
});

StyleDictionary.registerTransform({
  name: 'name/typography',
  type: 'name',
  transformer: function(token) {
    const slicePrefix = token.path.slice(1);
    const filterDesktop = slicePrefix.filter(prefix => prefix !== "desktop");

    return ChangeCase.camelCase(filterDesktop.join(" "));
  }
});

StyleDictionary.registerTransform({
  name: 'name/slice-one',
  type: 'name',
  transformer: function(token) {
    return ChangeCase.camelCase(token.path.slice(1).join(""));
  }
});

StyleDictionary.registerTransformGroup({
  name: 'custom/typography',
  transforms: [ 'name/typography', 'attribute/cti']
});

StyleDictionary.registerTransformGroup({
  name: 'custom/colors',
  transforms: [ 'name/slice-one', 'attribute/cti']
});

StyleDictionary.extend({
  platforms: {
    Owlery: {
      transformGroup: "custom/typography",
      buildPath: "build/scss/",
      files: [
        {
          destination: "typography.scss",
          format: "scss/variables",
          filter: "filter-typography",
        },
      ],
    },

    Owlery: {
      transformGroup: "custom/colors",
      buildPath: "build/scss/",
      files: [
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
      transformGroup: "custom/typography",
      buildPath: "build/ts/",
      files: [
        {
          format: "javascript/es6",
          destination: "typography.ts",
          filter: "filter-typography",
        },
      ],
    },

    Aviary: {
      transformGroup: "custom/colors",
      buildPath: "build/ts/",
      files: [
        {
          format: "javascript/es6",
          destination: "colors.ts",
          filter: {
            type: "color",
          },
        },
      ],
    },
  },
}).buildAllPlatforms();
