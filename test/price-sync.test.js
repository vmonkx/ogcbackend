'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { IncomingMessage, ServerResponse } = require('node:http');
const { Socket } = require('node:net');
const Koa = require('koa');
const Router = require('@koa/router');
const compose = require('koa-compose');
const createAuthentication = require('../node_modules/@strapi/core/dist/services/auth/index.js');
const registerAllRoutes = require('../node_modules/@strapi/core/dist/services/server/register-routes.js');
const { createRouteManager } = require('../node_modules/@strapi/core/dist/services/server/routing.js');
const { errors } = require('../node_modules/@strapi/core/dist/middlewares/errors.js');
const adminStrategy = require('../node_modules/@strapi/admin/dist/server/server/src/strategies/admin.js').default;
const isAuthenticatedAdmin = require('../node_modules/@strapi/admin/dist/server/server/src/policies/isAuthenticatedAdmin.js');
const hasPermissions = require('../node_modules/@strapi/admin/dist/server/server/src/policies/hasPermissions.js');
const createActionProvider = require('../node_modules/@strapi/admin/dist/server/server/src/domain/action/provider.js');
const createPriceSyncLock = require('../src/helpers/createPriceSyncLock');
const ACTION = 'admin::services.sync-prices';

// Stub only external data access. Route composition, admin authentication,
// permission registration and permission policies use the installed Strapi.
function loadModule(relativePath, mocks = {}, globals = {}) {
  const filename = path.resolve(__dirname, '..', relativePath);
  const module = { exports: {} };
  const realRequire = createRequire(filename);
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
    module,
    exports: module.exports,
    require: (name) => name in mocks ? mocks[name] : realRequire(name),
    process: { env: {} },
    AbortSignal,
    console: { error() {} },
    ...globals,
  }, { filename });
  return module.exports;
}

async function routeHarness(sync = async () => ({ created: 1, updated: 2, errors: 0 })) {
  let calls = 0;
  let adminTokenCalls = 0;
  const actionProvider = createActionProvider();
  const permissionService = {
    actionProvider,
    engine: {
      generateUserAbility: async (user) => ({ can: (action) => user.id === 1 && action === ACTION }),
    },
  };
  const auth = createAuthentication();
  auth.register('admin', adminStrategy);
  auth.register('admin', {
    name: 'admin-token',
    authenticate: async () => { adminTokenCalls++; return { authenticated: true }; },
  });
  const router = new Router();
  const api = { routes: { sync: require('../src/api/service/routes/sync') } };
  const strapi = {
    isLoaded: false,
    admin: { routes: {} },
    apis: { service: api },
    api: () => api,
    plugins: {},
    dirs: { app: { root: path.resolve(__dirname, '..') } },
    config: { get: (_, fallback) => fallback },
    contentAPI: { applyExtraParamsToRoutes() {} },
    documents: { use() {} },
    log: { error() {} },
    sessionManager: () => ({
      validateAccessToken(token) {
        const ids = { permitted: '1', forbidden: '2', inactive: '3', revoked: '1' };
        return ids[token]
          ? { isValid: true, payload: { userId: ids[token], sessionId: token } }
          : { isValid: false };
      },
      isSessionActive: async (id) => id !== 'revoked',
    }),
    db: {
      query: () => ({ findOne: async ({ where }) => ({ id: where.id, isActive: where.id !== 3, roles: [] }) }),
    },
    service(name) {
      if (name === 'admin::permission') return permissionService;
      if (name === 'api::service.service') return { syncPrices: async () => { calls++; return sync(); } };
      throw new Error(`Unexpected service ${name}`);
    },
    get(name) {
      if (name === 'auth') return auth;
      if (name === 'policies') return {
        resolve(configs) {
          return configs.map((config) => {
            if (config === 'admin::isAuthenticatedAdmin') return { handler: isAuthenticatedAdmin, config: {} };
            assert.equal(config.name, 'admin::hasPermissions');
            hasPermissions.validator(config.config);
            return { handler: hasPermissions.handler, config: config.config };
          });
        },
      };
      throw new Error(`Unexpected registry ${name}`);
    },
    controller(name) {
      return name === 'api::service.sync' ? controller : undefined;
    },
    server: {
      routes(definition) {
        createRouteManager(strapi, { type: definition.type }).addRoutes(definition, router);
      },
    },
  };
  global.strapi = strapi;
  const controller = loadModule('src/api/service/controllers/sync.js', {}, { strapi });
  const appLifecycle = loadModule('src/index.js', { './helpers/getGradient': () => {} });
  await appLifecycle.register({ strapi });
  assert.ok(actionProvider.has(ACTION), 'permission is registered during application startup');
  registerAllRoutes(strapi);

  const app = new Koa();
  app.use(errors());
  app.use(async (ctx, next) => {
    ctx.send = (body) => { ctx.body = body; };
    ctx.unauthorized = (message) => { ctx.status = 401; ctx.body = { message }; };
    ctx.forbidden = () => { ctx.status = 403; ctx.body = { message: 'Forbidden' }; };
    ctx.notFound = () => { ctx.status = 404; ctx.body = { message: 'Not Found' }; };
    await next();
  });
  app.use(router.routes());
  app.use(router.allowedMethods());
  return {
    get calls() { return calls; },
    get adminTokenCalls() { return adminTokenCalls; },
    async request(url, authorization, extraHeaders = {}) {
      const req = new IncomingMessage(new Socket());
      req.method = 'POST';
      req.url = url;
      req.headers = { ...extraHeaders, ...(authorization ? { authorization } : {}) };
      const res = new ServerResponse(req);
      const ctx = app.createContext(req, res);
      await compose(app.middleware)(ctx);
      return { status: ctx.status, body: ctx.body };
    },
  };
}

test('anonymous, mobile, content API and invalid admin credentials never start synchronization', async () => {
  const app = await routeHarness();
  for (const headers of [
    [undefined, {}],
    [undefined, { 'x-app-token': 'mobile-secret' }],
    ['Bearer content-api-token', {}],
    ['Bearer admin-api-token', {}],
    ['Bearer invalid', {}],
    ['Basic permitted', {}],
    ['Bearer revoked', {}],
    ['Bearer inactive', {}],
  ]) {
    const result = await app.request('/admin/services/sync-prices', ...headers);
    assert.equal(result.status, 401);
  }
  assert.equal(app.calls, 0);
  assert.equal(app.adminTokenCalls, 0, 'route selects only admin session authentication');
});

test('an admin without the synchronization permission receives 403 and cannot write prices', async () => {
  const app = await routeHarness();
  const response = await app.request('/admin/services/sync-prices', 'Bearer forbidden');
  assert.equal(response.status, 403);
  assert.equal(app.calls, 0);
});

test('an authorized admin runs synchronization and receives its counters', async () => {
  const app = await routeHarness();
  const response = await app.request('/admin/services/sync-prices', 'Bearer permitted');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.data, { created: 1, updated: 2, errors: 0 });
  assert.equal(app.calls, 1);
});

test('the former public endpoint is unavailable even with admin credentials', async () => {
  const app = await routeHarness();
  for (const authorization of [undefined, 'Bearer permitted']) {
    const result = await app.request('/api/services/sync-prices', authorization);
    assert.equal(result.status, 404);
  }
  assert.equal(app.calls, 0);
});

test('the admin endpoint returns 409 for a concurrent run', async () => {
  const withLock = createPriceSyncLock({ db: { dialect: { client: 'sqlite' } } });
  let finish;
  const pending = new Promise((resolve) => { finish = resolve; });
  const app = await routeHarness(() => withLock(() => pending));
  const first = app.request('/admin/services/sync-prices', 'Bearer permitted');
  await new Promise((resolve) => setImmediate(resolve));
  try {
    const second = await app.request('/admin/services/sync-prices', 'Bearer permitted');
    assert.equal(second.status, 409);
  } finally {
    finish({ created: 0, updated: 0, errors: 0 });
    assert.equal((await first).status, 200);
  }
});

test('unexpected failures do not disclose internal errors to the admin client', async () => {
  const app = await routeHarness(async () => { throw new Error('private database credentials'); });
  const result = await app.request('/admin/services/sync-prices', 'Bearer permitted');
  assert.equal(result.status, 500);
  assert.ok(!JSON.stringify(result.body).includes('private database credentials'));
});

test('the process lock releases after success and failure', async () => {
  const withLock = createPriceSyncLock({ db: { dialect: { client: 'sqlite' } } });
  assert.equal(await withLock(async () => 1), 1);
  await assert.rejects(withLock(async () => { throw new Error('database unavailable'); }), /database unavailable/);
  assert.equal(await withLock(async () => 2), 2);
});

function sharedPostgres() {
  let locked = false;
  let released = 0;
  const keys = [];
  const db = {
    dialect: { client: 'postgres' },
    connection: {
      async transaction(callback) {
        let ownsLock = false;
        try {
          return await callback({
            async raw(sql, bindings) {
              assert.equal(sql, 'SELECT pg_try_advisory_xact_lock(?, ?) AS acquired');
              keys.push(bindings);
              if (locked) return { rows: [{ acquired: false }] };
              ownsLock = true;
              locked = true;
              return { rows: [{ acquired: true }] };
            },
          });
        } finally {
          if (ownsLock) { locked = false; released++; }
        }
      },
    },
  };
  return { db, keys, get released() { return released; } };
}

test('separate CMS instances share the PostgreSQL lock and can retry after completion', async () => {
  const shared = sharedPostgres();
  const firstInstance = createPriceSyncLock({ db: shared.db });
  const secondInstance = createPriceSyncLock({ db: shared.db });
  let finish;
  const pending = new Promise((resolve) => { finish = resolve; });
  const first = firstInstance(() => pending);
  await new Promise((resolve) => setImmediate(resolve));
  let writes = 0;
  try {
    await assert.rejects(secondInstance(async () => { writes++; }), { code: 'PRICE_SYNC_IN_PROGRESS' });
    assert.equal(writes, 0);
  } finally {
    finish();
    await first;
  }
  await secondInstance(async () => { writes++; });
  assert.equal(writes, 1);
  assert.equal(shared.released, 2);
  assert.deepEqual(shared.keys[0], shared.keys[1]);
});

test('a failed PostgreSQL run releases both locks', async () => {
  const shared = sharedPostgres();
  const withLock = createPriceSyncLock({ db: shared.db });
  await assert.rejects(withLock(async () => { throw new Error('failed'); }), /failed/);
  assert.equal(await withLock(async () => 42), 42);
  assert.equal(shared.released, 2);
});

function serviceHarness(get, findServices = async () => [{ documentId: 'service-one' }]) {
  const writes = [];
  const prices = {
    findMany: async () => [{ documentId: 'existing-price', title: 'Existing' }],
    create: async (data) => { writes.push(['create', data]); },
    update: async (data) => { writes.push(['update', data]); },
  };
  const strapi = {
    db: { dialect: { client: 'sqlite' } },
    documents: (uid) => uid === 'api::service.service' ? { findMany: findServices } : prices,
  };
  const factory = loadModule('src/api/service/services/service.js', {
    axios: { get },
    '@strapi/strapi': { factories: { createCoreService: (_, callback) => callback } },
  });
  return { service: factory({ strapi }), writes };
}

test('authorized synchronization still creates and updates prices from BFF with bounded requests', async () => {
  const { service, writes } = serviceHarness(async (url, options) => {
    assert.ok(url.endsWith('/api/v1/services/external/service-one'));
    assert.equal(options.timeout, 15000);
    assert.ok(options.signal instanceof AbortSignal);
    assert.equal(options.signal.aborted, false);
    return { data: [
      { id: 'folder-one', name: 'Existing', isFolder: true },
      { id: 'folder-two', name: 'New', isFolder: true },
      { parentId: 'folder-one', siteName: 'Consultation', sku: 'C1', duration: 30, price: 2500, isFolder: false },
      { parentId: 'folder-two', siteName: 'Treatment', sku: 'T1', duration: 60, price: 5000, isFolder: false },
    ] };
  });
  assert.equal(JSON.stringify(await service.syncPrices()), JSON.stringify({ created: 1, updated: 1, errors: 0 }));
  assert.equal(writes[0][0], 'update');
  assert.equal(writes[0][1].documentId, 'existing-price');
  assert.equal(writes[0][1].data.priceItem[0].price, '2500');
  assert.equal(writes[1][0], 'create');
  assert.equal(writes[1][1].data.service, 'service-one');
});

test('BFF timeout counts an error, writes no prices and allows a later run', async () => {
  let timedOut = true;
  const { service, writes } = serviceHarness(async () => {
    if (timedOut) throw Object.assign(new Error('timeout'), { code: 'ECONNABORTED' });
    return { data: [] };
  });
  assert.equal((await service.syncPrices()).errors, 1);
  assert.equal(writes.length, 0);
  timedOut = false;
  assert.equal((await service.syncPrices()).errors, 0);
});

test('an initial CMS query failure also releases the synchronization lock', async () => {
  let failed = true;
  const { service } = serviceHarness(async () => ({ data: [] }), async () => {
    if (failed) throw new Error('database unavailable');
    return [];
  });
  await assert.rejects(service.syncPrices(), /database unavailable/);
  failed = false;
  assert.equal((await service.syncPrices()).errors, 0);
});

function buttonHarness({ slug = 'api::price.price', permitted = true, checkingPermissions = false, post = async () => ({ data: { data: { created: 1, updated: 2, errors: 0 } } }) } = {}) {
  const filename = path.resolve(__dirname, '../src/admin/components/SyncPricesButton.jsx');
  const { transformSync } = require('esbuild');
  const { code } = transformSync(fs.readFileSync(filename, 'utf8'), { loader: 'jsx', format: 'cjs' });
  const module = { exports: {} };
  const React = require('react');
  const notifications = [];
  vm.runInNewContext(code, {
    module,
    exports: module.exports,
    require(name) {
      if (name === 'react') return { ...React, useState: () => [false, () => {}] };
      if (name === '@strapi/design-system') return { Button: () => null };
      if (name === 'react-router-dom') return { useParams: () => ({ slug }) };
      if (name === '@strapi/strapi/admin') return {
        useFetchClient: () => ({ post }),
        useNotification: () => ({ toggleNotification: (value) => notifications.push(value) }),
        useRBAC: (permissions) => {
          assert.equal(permissions[0].action, ACTION);
          return { allowedActions: { canSyncPrices: permitted }, isLoading: checkingPermissions };
        },
      };
      throw new Error(`Unexpected UI dependency ${name}`);
    },
  }, { filename });
  return { button: module.exports.default(), notifications };
}

test('the admin button hides from users without the synchronization permission', () => {
  assert.equal(buttonHarness({ permitted: false }).button, null);
});

test('the admin button calls the authenticated client at the admin endpoint', async () => {
  const calls = [];
  const { button, notifications } = buttonHarness({
    post: async (url) => {
      calls.push(url);
      return { data: { data: { created: 1, updated: 2, errors: 0 } } };
    },
  });
  await button.props.onClick();
  assert.deepEqual(calls, ['/admin/services/sync-prices']);
  assert.equal(notifications[0].type, 'success');
});

test('the admin button explains a concurrent run using Strapi FetchError.status', async () => {
  const { button, notifications } = buttonHarness({
    post: async () => { throw Object.assign(new Error('Conflict'), { status: 409 }); },
  });
  await button.props.onClick();
  assert.equal(notifications[0].message, 'Синхронизация прайс-листов уже выполняется');
});


test('the synchronization button is visible in both Price and Service lists', () => {
  for (const slug of ['api::price.price', 'api::service.service']) {
    const { button } = buttonHarness({ slug });
    assert.ok(button, `button missing for ${slug}`);
    assert.equal(button.props.children, 'Синхронизировать прайсы');
  }
});

test('the synchronization button does not appear in unrelated content types', () => {
  for (const slug of ['api::category.category', undefined]) {
    assert.equal(buttonHarness({ slug: slug ?? '' }).button, null);
  }
});

test('the synchronization button stays hidden until permission checking completes', () => {
  assert.equal(buttonHarness({ checkingPermissions: true }).button, null);
});


test('synchronization processes only published Service versions, excluding draft-only and unpublished services', async () => {
  const versions = [
    { documentId: 'published-service', publishedAt: '2026-10-06T12:00:00Z' },
    { documentId: 'published-service', publishedAt: null },
    { documentId: 'draft-only-service', publishedAt: null },
    { documentId: 'unpublished-service', publishedAt: null },
  ];
  const requestedIds = [];
  const { service, writes } = serviceHarness(async (url) => {
    requestedIds.push(url.split('/').at(-1));
    return { data: [
      { id: 'folder', name: 'New', isFolder: true },
      { parentId: 'folder', siteName: 'Consultation', sku: 'C1', price: 2500, isFolder: false },
    ] };
  }, async ({ status }) => {
    // Match Document Service semantics: the default query returns draft versions.
    return versions.filter((item) => status === 'published' ? item.publishedAt !== null : item.publishedAt === null);
  });
  const result = await service.syncPrices();
  assert.deepEqual(requestedIds, ['published-service']);
  assert.equal(result.created, 1);
  assert.equal(writes.length, 1);
  assert.equal(writes[0][1].data.service, 'published-service');
});

test('no published Service means no BFF calls or price writes', async () => {
  let bffCalls = 0;
  const { service, writes } = serviceHarness(async () => {
    bffCalls++;
    return { data: [] };
  }, async ({ status }) => status === 'published' ? [] : [{ documentId: 'draft-only-service' }]);
  const result = await service.syncPrices();
  assert.equal(bffCalls, 0);
  assert.equal(writes.length, 0);
  assert.equal(result.created, 0);
  assert.equal(result.updated, 0);
  assert.equal(result.errors, 0);
});
