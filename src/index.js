'use strict';
const getGradient = require("./helpers/getGradient");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    strapi.documents.use(async (context, next) => {
      const uids = ['api::category.category', 'api::service.service'];
      
      if (uids.includes(context.uid) && ['create', 'update'].includes(context.action)) {
        const data = context.params.data;
        
        // If we have an image and need to calculate the gradient
        if (data && data.coverColor && data.coverColor.urlImage && (!data.coverColor.gradientStart || !data.coverColor.gradientEnd)) {
           const gradient = await getGradient(data.coverColor.urlImage);
           context.params.data.coverColor.gradientStart = gradient.gradientStart;
           context.params.data.coverColor.gradientEnd = gradient.gradientEnd;
        }
      }
      return next();
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};