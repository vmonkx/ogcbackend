'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/services/sync-prices',
      handler: 'sync.syncPricesHandler',
      config: {
        auth: false, // Since this might be called from Admin UI which has its own token? Actually wait, if auth: false, it's public. For admin, we should maybe secure it, but let's keep it simple or use policies.
      }
    }
  ]
};
