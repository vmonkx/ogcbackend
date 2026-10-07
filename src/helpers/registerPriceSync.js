'use strict';

const SYNC_PERMISSION = 'admin::services.sync-prices';

module.exports = async function registerPriceSync(strapi) {
  await strapi.service('admin::permission').actionProvider.registerMany([
    {
      uid: 'services.sync-prices',
      pluginName: 'admin',
      displayName: 'Синхронизировать прайсы',
      section: 'settings',
      category: 'price synchronization',
      subCategory: 'general',
    },
  ]);

  strapi.admin.routes.priceSync = {
    type: 'admin',
    prefix: '/admin',
    routes: [
      {
        method: 'POST',
        path: '/services/sync-prices',
        handler: 'api::service.sync.syncPricesHandler',
        config: {
          auth: { strategies: ['admin'], scope: [SYNC_PERMISSION] },
          policies: [
            'admin::isAuthenticatedAdmin',
            {
              name: 'admin::hasPermissions',
              config: { actions: [SYNC_PERMISSION] },
            },
          ],
        },
      },
    ],
  };
};
