'use strict';

module.exports = {
  async syncPricesHandler(ctx) {
    try {
      const result = await strapi.service('api::service.service').syncPrices();
      ctx.send({
        message: 'Prices synchronized successfully',
        data: result,
      });
    } catch (err) {
      ctx.throw(500, err);
    }
  }
};
