"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

const slugify = require("slugify");

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      
      
      if (data.name && !data.slug) {
        data.slug = slugify(data.name, { lower: true });
      } else {
        data.slug = data.slug.toLowerCase();
      }
    },
    beforeUpdate: async (params, data) => {
     
      if (data.name && !data.slug) {
        data.slug = slugify(data.name, { lower: true });
      } else {
        data.slug = data.slug?.toLowerCase();
      }
    },
  },
};
