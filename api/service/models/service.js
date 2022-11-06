"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

const slugify = require("slugify");
const { getAverageColor } = require("fast-average-color-node");

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (data.name && !data.slug) {
        data.slug = slugify(data.name, { lower: true });
      } else {
        data.slug = data.slug.toLowerCase();
      }

      if (!data.coverColor?.urlImage) {
        data.coverColor.gradientStart = "rgba(182, 180, 193,1)";
        data.coverColor.gradientEnd = `rgba(182, 180, 193, 0)`;
      } else {
        const color = await getAverageColor(data.coverColor.urlImage, {
          width: 50,
        });
        const colorEnd = [].concat(color.value.slice(0, 3), 0).join(",");
        data.coverColor.gradientStart = color.rgba;
        data.coverColor.gradientEnd = `rgba(${colorEnd})`;
      }
    },
    beforeUpdate: async (params, data) => {
      if (data.published_at !== undefined) {
        return;
      }

      if (data.name && !data.slug) {
        data.slug = slugify(data.name, { lower: true });
      } else {
        data.slug = data.slug?.toLowerCase();
      }

      if (!data.coverColor?.urlImage) {
        data.coverColor.gradientStart = "rgba(182, 180, 193,1)";
        data.coverColor.gradientEnd = `rgba(182, 180, 193, 0)`;
      } else {
        const color = await getAverageColor(data.coverColor.urlImage, {
          width: 50,
        });
        const colorEnd = [].concat(color.value.slice(0, 3), 0).join(",");
        data.coverColor.gradientStart = color.rgba;
        data.coverColor.gradientEnd = `rgba(${colorEnd})`;
      }
    },
  },
};
