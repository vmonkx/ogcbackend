# Price synchronization access

`POST /api/services/sync-prices` is no longer registered. The admin button uses
`POST /admin/services/sync-prices` through Strapi's authenticated fetch client.
The button is visible in both the Price and Service lists for authorized roles.
Only active admin sessions with `admin::services.sync-prices` can run it;
Content API users, API tokens, admin API tokens and mobile app tokens cannot.

The permission appears in admin roles under Settings → Price synchronization
as «Синхронизировать прайсы». Super Admin has this permission through Strapi's
standard role handling. Other roles require an explicit grant; this change does
not automatically grant them access.

Concurrent runs return HTTP 409. PostgreSQL uses a transaction advisory lock
shared by all CMS instances connected to the same database, plus a process lock
for immediate rejection. The lock transaction uses one pool connection while
Document Service uses others, so the PostgreSQL pool must allow at least two
connections (the current configuration allows ten). Non-PostgreSQL databases
have process-local locking and must run a single CMS process for this operation.

Synchronization selects only published Service versions using `status: 'published'`.
Draft-only and unpublished services are excluded. A service with pending edits
still participates through its existing published version.

Each BFF request has a 15-second response timeout and an abort deadline that also
bounds connection establishment. Failures continue to contribute to the
existing per-service error count. Unexpected controller failures return a
generic message without internal error details.

Run regression checks with `node --test test/price-sync.test.js`, then rebuild
the admin panel with `npm run build` and restart/redeploy the CMS. Tests stub CMS
and BFF data access and do not modify production prices.

## Admin bundle contexts

`src/admin/vite.config.js` resolves both `@strapi/strapi/admin` and
`@strapi/admin/strapi-admin` (including the EE entry) to the ESM exports used by
this application's Strapi package. Injected components and plugins must share
one Auth/Notifications context; a nested copy of `@strapi/admin` can otherwise
cause `useRBAC must be used within Auth` in production. Keep these exact export
aliases when extending the Vite configuration.

Run `node --test test/admin-singletons.test.js test/price-sync.test.js` before
building. The singleton regression test deliberately supplies a plugin with its
own nested admin dependency and checks that Vite resolves it to the host module.
It tests module resolution, not a live authenticated browser session.

For Dokploy/Railpack, deploy the commit containing this configuration and verify
that the build log runs the project's `npm run build` script and that the runtime
starts with `npm start`. Reload the admin page after deployment. A Git pull alone
is not needed when Dokploy already builds and deploys each new commit.

If the production error persists, collect the browser console stack and run
`npm ls @strapi/strapi @strapi/admin react react-dom` inside the deployed container
to compare dependency versions. The reported VPS failure has not been reproduced
in the local production build, so its specific cause still needs server evidence.
