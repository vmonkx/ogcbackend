import { createRequire } from 'node:module';
import path from 'node:path';
import { mergeConfig } from 'vite';

export default (config) => {
  const appRequire = createRequire(path.join(config.root, 'package.json'));
  const strapiPackagePath = appRequire.resolve('@strapi/strapi/package.json');
  const strapiRequire = createRequire(strapiPackagePath);
  const adminPackagePath = strapiRequire.resolve('@strapi/admin/package.json');
  const strapiPackage = appRequire(strapiPackagePath);
  const adminPackage = strapiRequire(adminPackagePath);

  // Hooks in injected components must share Auth/Notifications with the host.
  // Use exact ESM export aliases: a package-directory alias bypasses exports,
  // and nested plugin dependencies can otherwise create another context.
  const esmExport = (packagePath, manifest, subpath) =>
    path.resolve(path.dirname(packagePath), manifest.exports[subpath].import);

  return mergeConfig(config, {
    resolve: {
      dedupe: ['@strapi/admin', '@strapi/strapi'],
      alias: [
        {
          find: /^@strapi\/strapi\/admin$/,
          replacement: esmExport(strapiPackagePath, strapiPackage, './admin'),
        },
        {
          find: /^@strapi\/admin\/strapi-admin$/,
          replacement: esmExport(adminPackagePath, adminPackage, './strapi-admin'),
        },
        {
          find: /^@strapi\/admin\/strapi-admin\/ee$/,
          replacement: esmExport(adminPackagePath, adminPackage, './strapi-admin/ee'),
        },
        { find: '@', replacement: '/src' },
      ],
    },
    optimizeDeps: {
      include: [
        'property-expr',
        'toposort',
        'fuzzysort',
        'es-toolkit/compat/isEqual',
        'extend',
        'debug',
        'sanitize-html',
      ],
    },
  });
};
