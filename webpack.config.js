/**
 * We have upgraded our dev server builder to use esbuild
 * However, Karma does not support esbuild so it still uses webpack to build
 * the testing bundles.
 *
 * This webpack config is only used by Karma to build the testing bundles.
 */

module.exports = {
  experiments: {
    outputModule: true,
  },
  output: {
    module: true,
  },
  module: {
    parser: {
      javascript: {
        // we need the importMeta option so that when we use import.meta.url
        // it returns a relative path instead of a file:// protocol path
        importMeta: false,

        // by setting url, the URL constructor can be used to parse URLs
        // and it will return a URL object that point to webpack aware urls
        // instead of file:// protocol paths
        url: true,

        // we need commonjsMagicComments so that we can use dynamic imports
        // that are not bundled by webpack
        commonjsMagicComments: true,
      },
    },
  },
};
