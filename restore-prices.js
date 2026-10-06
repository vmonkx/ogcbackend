const strapi = require('@strapi/strapi');
const fs = require('fs');

strapi().start().then(async app => {
  try {
    if (!fs.existsSync('prices_backup.json')) {
      console.error('Backup file prices_backup.json not found!');
      process.exit(1);
    }

    const backupData = fs.readFileSync('prices_backup.json', 'utf8');
    const prices = JSON.parse(backupData);

    console.log(`Found ${prices.length} prices in backup. Starting restore...`);

    let created = 0;
    let errors = 0;

    for (const price of prices) {
      try {
        // Prepare data for creation (removing internal ids to avoid conflicts)
        const priceData = {
          title: price.title,
          service: price.service ? price.service.documentId : null,
          priceItem: price.priceItem ? price.priceItem.map(item => ({
            name: item.name,
            description: item.description,
            code: item.code,
            duration: item.duration,
            price: item.price
          })) : [],
          publishedAt: price.publishedAt
        };

        await app.documents('api::price.price').create({
          data: priceData
        });
        
        created++;
      } catch (err) {
        console.error(`Error restoring price "${price.title}":`, err.message);
        errors++;
      }
    }

    console.log(`Restore complete: ${created} created, ${errors} errors.`);
  } catch (err) {
    console.error('Failed to restore prices:', err);
  } finally {
    process.exit(0);
  }
});
