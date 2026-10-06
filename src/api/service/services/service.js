'use strict';

/** @type {import('axios').AxiosStatic} */
const axios = require('axios');

/**
 * service service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::service.service', ({ strapi }) => ({
  async syncPrices() {
    const services = await strapi.documents('api::service.service').findMany({ limit: -1 });

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const service of services) {
      if (!service.documentId) continue;

      try {
        const bffUrl = process.env.BFF_API_URL || 'http://127.0.0.1:3057';
        // In local development we will try to reach the BFF API
        const response = await axios.get(`${bffUrl}/api/v1/services/external/${service.documentId}`, {
          headers: {
            'X-App-Token': process.env.APP_TOKEN || 'your_mobile_app_secret_token'
          }
        });

        const items = response.data;
        if (!Array.isArray(items)) continue;

        const folders = items.filter(item => item.isFolder === true || String(item.isFolder) === 'true');
        const leafs = items.filter(item => item.isFolder === false || String(item.isFolder) === 'false');

        // Group leafs by folder UID
        const leafsByFolder = {};
        for (const leaf of leafs) {
          const parentUid = leaf.parentId;
          if (!leafsByFolder[parentUid]) {
            leafsByFolder[parentUid] = [];
          }
          leafsByFolder[parentUid].push(leaf);
        }

        // Fetch existing prices for this service
        const existingPrices = await strapi.documents('api::price.price').findMany({
          filters: { service: { documentId: service.documentId } },
          limit: -1
        });

        // Find which folders are parents of other folders
        const parentFolderIds = new Set(folders.map(f => f.parentId));

        for (const folder of folders) {
          if (parentFolderIds.has(folder.id)) continue;

          const folderUid = folder.id;
          const folderName = folder.name;

          const folderLeafs = leafsByFolder[folderUid] || [];

          const priceItems = folderLeafs.map(leaf => ({
            name: leaf.siteName,
            code: leaf.sku,
            duration: leaf.duration != null ? String(`${leaf.duration} мин.`) : null,
            price: leaf.price != null ? String(leaf.price) : null
          }));

          // Find existing price by title
          const existing = existingPrices.find(p => p.title === folderName);

          if (existing) {
            await strapi.documents('api::price.price').update({
              documentId: existing.documentId,
              data: {
                priceItem: priceItems
              }
            });
            updated++;
          } else {
            await strapi.documents('api::price.price').create({
              data: {
                title: folderName,
                service: service.documentId,
                priceItem: priceItems,
                publishedAt: new Date()
              }
            });
            created++;
          }
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // It's possible the service doesn't have prices in BFF, ignore
        } else {
          console.error(`Failed to sync prices for service ${service.documentId}:`, err.message);
          errors++;
        }
      }
    }

    return { created, updated, errors };
  }
}));