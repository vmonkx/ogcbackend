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
      if (err.code === 'PRICE_SYNC_IN_PROGRESS') {
        ctx.throw(409, 'Price synchronization already in progress');
      }
      strapi.log.error('Price synchronization failed');
      ctx.throw(500, 'Price synchronization failed');
    }
  },
};
