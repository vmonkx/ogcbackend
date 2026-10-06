const strapi = require('@strapi/strapi');
const fs = require('fs');

strapi().start().then(async app => {
  try {
    console.log('Fetching prices...');
    const prices = await app.documents('api::price.price').findMany({
      limit: -1,
      populate: ['priceItem', 'service']
    });

    fs.writeFileSync('prices_backup.json', JSON.stringify(prices, null, 2));
    console.log(`Successfully backed up ${prices.length} price documents to prices_backup.json.`);
  } catch (err) {
    console.error('Failed to backup prices:', err);
  } finally {
    process.exit(0);
  }
});
