import { mergeConfig } from "vite";

export default (config) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    optimizeDeps: {
      include: [
        "property-expr",
        "toposort",
        "fuzzysort",
        "es-toolkit/compat/isEqual",
        "extend",
        "debug",
        "sanitize-html",
      ],
    },
  });
};