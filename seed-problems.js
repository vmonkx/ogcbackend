'use strict';

const { createStrapi } = require('@strapi/strapi');
const slugify = require('slugify');

const PROBLEMS_DATA = [
  {
    name: 'Коррекция фигуры и качество тела',
    shortName: 'Коррекция фигуры',
    order: 1,
    featured: true,
    symptoms: 'Локальные жировые отложения, снижение мышечного тонуса, дряблость кожи, отёчность, ощущение тяжести в ногах.',
    note: 'Окончательный метод, зону, препарат и курс определяет врач после консультации.',
    serviceKeywords: [
      'криолиполиз', 'cooltech', 'emsculpt', 'bbl hero', 'bbl', 'infini', 'инфини', 
      'альтера', 'ulthera', 'ultraformer', 'ультраформер', 'co2', 'лазерная шлифовка', 
      'прессотерапия', 'btl', 'эндосфера', 'endospheres', 'радиесс', 'radiesse', 
      'полимолочн', 'aesthefill', 'эстефил', 'контурная пластика', 'коррекция фигуры'
    ]
  },
  {
    name: 'Акне и воспаления',
    shortName: 'Акне',
    order: 2,
    featured: true,
    symptoms: 'Воспалительные элементы, жирный блеск, неровная текстура кожи, следы после высыпаний.',
    note: 'Очищающие процедуры проводятся за 3–5 дней до аппаратных методик по назначению специалиста.',
    serviceKeywords: [
      'forever clear', 'bbl', 'vbeam', 'вибим', 'heleo', 'хелео', 'фотодинамическ', 
      'биоревитализац', 'мезотерапи', 'чистка', 'очищающ', 'пилинг'
    ]
  },
  {
    name: 'Пигментация и неровный тон',
    shortName: 'Пигментация',
    order: 3,
    featured: true,
    symptoms: 'Пигментные пятна, веснушки, неравномерный тон кожи.',
    note: 'Очищающие процедуры проводятся за 3–5 дней до аппаратных методик по назначению специалиста.',
    serviceKeywords: [
      'bbl', 'vbeam', 'вибим', 'fotona', 'фотона', 'meline', 'пилинг', 'чистка', 'очищающ'
    ]
  },
  {
    name: 'Второй подбородок',
    shortName: 'Второй подбородок',
    order: 4,
    featured: false,
    symptoms: 'Локальные жировые отложения в подчелюстной зоне, недостаточно чёткий овал лица.',
    note: 'Окончательный метод и курс определяет врач после консультации.',
    serviceKeywords: [
      'криолиполиз', 'cooltech', 'альтера', 'ulthera', 'ultraformer', 'ультраформер', 
      'массаж', 'липолитик', 'эндосфера', 'endospheres'
    ]
  },
  {
    name: 'Выпадение волос',
    shortName: 'Выпадение волос',
    order: 5,
    featured: true,
    symptoms: 'Усиленное выпадение волос, необходимость поддерживающего ухода за кожей головы.',
    note: 'Для точной диагностики причины выпадения рекомендуется консультация трихолога.',
    serviceKeywords: [
      'мезотерапия кожи головы', 'мезотерапи', 'плазмотерапи', 'prp', 'cortexil', 
      'dermadrop', 'дермадроп', 'fotona', 'фотона', 'heleo', 'хелео', 'волос'
    ]
  },
  {
    name: 'Нечёткий овал лица',
    shortName: 'Овал лица',
    order: 6,
    featured: true,
    symptoms: 'Снижение упругости, провисание тканей, потеря чёткости овала.',
    note: 'Окончательный метод, препарат и курс определяет врач после консультации.',
    serviceKeywords: [
      'альтера', 'ulthera', 'ultraformer', 'ультраформер', 'radiesse', 'радиесс', 
      'aesthefill', 'эстефил', 'контурная пластика', 'fotona', 'фотона', 'volnewmer', 'вольньюмер'
    ]
  },
  {
    name: 'Рубцы и шрамы',
    shortName: 'Рубцы',
    order: 7,
    featured: false,
    symptoms: 'Рубцы после травм или операций, неровный рельеф кожи.',
    note: 'Метод коррекции подбирается индивидуально в зависимости от типа и давности рубца.',
    serviceKeywords: [
      'vbeam', 'вибим', 'fotona', 'фотона', 'co2', 'лазерная шлифовка', 'сферогель', 
      'коллост', 'nithya', 'инъекционн'
    ]
  },
  {
    name: 'Омоложение лица',
    shortName: 'Омоложение',
    order: 8,
    featured: true,
    symptoms: 'Снижение упругости, морщины, неровная текстура и тон кожи.',
    note: 'Очищающие процедуры — за 3–5 дней до аппаратных методик. Поддерживающие программы для подготовки и питания кожи, включая SkinKo, — по назначению врача.',
    serviceKeywords: [
      'bbl', 'forever young', 'vbeam', 'co2', 'лазерная шлифовка', 'альтера', 'ulthera', 
      'ultraformer', 'ультраформер', 'infini', 'инфини', 'биоревитализац', 'мезотерапи', 
      'контурная пластика', 'radiesse', 'радиесс', 'aesthefill', 'эстефил', 'полимолочн'
    ]
  },
  {
    name: 'Расширенные поры',
    shortName: 'Расширенные поры',
    order: 9,
    featured: false,
    symptoms: 'Выраженные поры, неровный микрорельеф, жирность кожи.',
    note: 'Очищающие процедуры — за 3–5 дней до аппаратных методик по назначению специалиста.',
    serviceKeywords: [
      'bbl', 'infini', 'инфини', 'co2', 'лазерная шлифовка', 'hydrafacial', 
      'хайдр', 'биоревитализац', 'чистка', 'пилинг'
    ]
  },
  {
    name: 'Увлажнение кожи лица',
    shortName: 'Увлажнение',
    order: 10,
    featured: false,
    symptoms: 'Сухость, обезвоженность, ощущение стянутости, тусклый вид кожи.',
    note: 'Курс подбирается индивидуально для глубокого и пролонгированного насыщения влагой.',
    serviceKeywords: [
      'dermadrop', 'дермадроп', 'hydrafacial', 'хайдр', 'мезотерапи', 'биоревитализац'
    ]
  },
  {
    name: 'Улучшение цвета лица',
    shortName: 'Цвет лица',
    order: 11,
    featured: false,
    symptoms: 'Тусклый и неровный тон кожи, снижение естественного сияния.',
    note: 'Рекомендуется комбинация аппаратных и уходовых методик для сияния кожи.',
    serviceKeywords: [
      'bbl', 'co2', 'лазерная шлифовка', 'hydrafacial', 'хайдр', 'dermadrop', 
      'дермадроп', 'мезотерапи', 'биоревитализац', 'пилинг'
    ]
  },
  {
    name: 'Растяжки',
    shortName: 'Растяжки',
    order: 12,
    featured: false,
    symptoms: 'Стрии на животе, бёдрах, ягодицах и других зонах тела.',
    note: 'Максимальный эффект достигается при раннем обращении и комплексном подходе.',
    serviceKeywords: [
      'vbeam', 'вибим', 'co2', 'лазерная шлифовка', 'infini', 'инфини'
    ]
  },
  {
    name: 'Носогубные складки',
    shortName: 'Носогубные складки',
    order: 13,
    featured: false,
    symptoms: 'Выраженные носогубные складки и потеря объёма мягких тканей.',
    note: 'Окончательный метод и препарат подбираются врачом после очной оценки мимики и анатомии.',
    serviceKeywords: [
      'контурная пластика', 'альтера', 'ulthera', 'ultraformer', 'ультраформер', 'radiesse', 'радиесс'
    ]
  },
  {
    name: 'Сосудистые изменения и покраснения',
    shortName: 'Сосуды и покраснения',
    order: 14,
    featured: true,
    symptoms: 'Сосудики, покраснения, проявления купероза и другие сосудистые изменения кожи.',
    note: 'Очищающие процедуры — за 3–5 дней до аппаратных методик по назначению специалиста.',
    serviceKeywords: [
      'bbl', 'vbeam', 'вибим', 'сосуд', 'купероз', 'розацеа', 'чистка'
    ]
  },
  {
    name: 'Морщины',
    shortName: 'Морщины',
    order: 15,
    featured: true,
    symptoms: 'Мимические и возрастные морщины, снижение плотности и упругости кожи.',
    note: 'Комбинация ботулинотерапии, аппаратного лифтинга и биоревитализации даёт комплексный результат.',
    serviceKeywords: [
      'bbl', 'infini', 'инфини', 'co2', 'лазерная шлифовка', 'fotona', 'фотона', 
      'ботулинотерапи', 'ботокс', 'диспорт', 'ксеомин', 'релатокс', 'биоревитализац', 
      'мезотерапи', 'контурная пластика', 'миорелаксант'
    ]
  }
];

async function seed() {
  const app = await createStrapi().load();

  try {
    console.log('--- Loading existing services from Strapi ---');
    const existingServices = await app.documents('api::service.service').findMany({ limit: -1 });
    console.log(`Found ${existingServices.length} services in database.`);

    for (const service of existingServices) {
      console.log(` - [${service.documentId}] ${service.name}`);
    }

    console.log('\n--- Loading existing problems ---');
    const existingProblems = await app.documents('api::problem.problem').findMany({ limit: -1 });
    console.log(`Found ${existingProblems.length} problems in database.`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const item of PROBLEMS_DATA) {
      const slug = slugify(item.name, { lower: true, strict: true }) || slugify(item.shortName, { lower: true, strict: true });
      
      // Find matching services by keywords
      const matchedServices = existingServices.filter(service => {
        const serviceNameLower = (service.name || '').toLowerCase();
        return item.serviceKeywords.some(keyword => serviceNameLower.includes(keyword.toLowerCase()));
      });

      const matchedServiceDocumentIds = matchedServices.map(s => s.documentId);

      const problemPayload = {
        name: item.name,
        shortName: item.shortName,
        order: item.order,
        featured: item.featured,
        symptoms: item.symptoms,
        note: item.note,
        slug: slug,
        services: matchedServiceDocumentIds,
        publishedAt: new Date()
      };

      const existing = existingProblems.find(p => p.name === item.name || p.slug === slug);

      if (existing) {
        await app.documents('api::problem.problem').update({
          documentId: existing.documentId,
          data: problemPayload
        });
        console.log(`✔ Updated problem: "${item.name}" (Matched ${matchedServices.length} services)`);
        updatedCount++;
      } else {
        await app.documents('api::problem.problem').create({
          data: problemPayload
        });
        console.log(`✔ Created problem: "${item.name}" (Matched ${matchedServices.length} services)`);
        createdCount++;
      }
    }

    console.log(`\nSeed completed: ${createdCount} created, ${updatedCount} updated.`);

    // Configure public permissions for api::problem.problem
    console.log('\n--- Configuring Public Permissions for api::problem.problem ---');
    try {
      const roles = await app.documents('plugin::users-permissions.role').findMany({
        filters: { type: 'public' },
        populate: ['permissions']
      });

      const publicRole = roles[0];
      if (publicRole) {
        const problemActions = ['find', 'findOne'];
        const existingActionNames = (publicRole.permissions || [])
          .filter(p => p.action && p.action.startsWith('api::problem.problem.'))
          .map(p => p.action.replace('api::problem.problem.', ''));

        for (const action of problemActions) {
          const actionFull = `api::problem.problem.${action}`;
          if (!existingActionNames.includes(action)) {
            await app.documents('plugin::users-permissions.permission').create({
              data: {
                action: actionFull,
                role: publicRole.documentId
              }
            });
            console.log(`✔ Granted public permission: ${actionFull}`);
          } else {
            console.log(`ℹ Permission already exists: ${actionFull}`);
          }
        }
      }
    } catch (permErr) {
      console.warn('Notice on configuring public permissions:', permErr.message);
    }

  } catch (err) {
    console.error('Error during problem seed:', err);
  } finally {
    await app.destroy();
    process.exit(0);
  }
}

seed();
