'use strict';

function busyError() {
  const error = new Error('Price synchronization already in progress');
  error.code = 'PRICE_SYNC_IN_PROGRESS';
  return error;
}

module.exports = function createPriceSyncLock(strapi) {
  let running = false;

  return async function withPriceSyncLock(sync) {
    if (running) throw busyError();
    running = true;

    try {
      if (strapi.db.dialect.client !== 'postgres') {
        // Local SQLite and other single-process deployments.
        return await sync();
      }

      // A dedicated Knex transaction holds only the advisory lock. Document
      // writes retain their existing transaction semantics on other connections.
      // PostgreSQL releases this lock on completion or a disconnected process.
      return await strapi.db.connection.transaction(async (trx) => {
        const result = await trx.raw(
          'SELECT pg_try_advisory_xact_lock(?, ?) AS acquired',
          [0x4f4743, 1], // Application namespace "OGC", price synchronization.
        );
        if (result.rows[0]?.acquired !== true) throw busyError();
        return await sync();
      });
    } finally {
      running = false;
    }
  };
};
