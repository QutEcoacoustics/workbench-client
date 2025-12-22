import path from "path";
import webpack from "webpack";
import baseConfig from "../webpack.config.mjs";

const inPath = path.resolve("dist/web-components/fesm2022/ecoacoustics-baw-web-components.mjs");
const outPath = path.resolve("dist/web-components");

// Merge user webpack config with our runtime fields
const config = {
  ...baseConfig,
  entry: inPath,
  output: {
    path: outPath,
    filename: "web-components.custom.js",
    library: "WebComponents",
    libraryTarget: "umd",
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  mode: "production",
};

const compiler = webpack(config);
compiler.run((err, stats) => {
  if (err) {
    console.error("Webpack error:", err);
    process.exit(2);
  } else if (stats) {
    console.log(stats.toString({ colors: true, modules: false }));
  }

  compiler.close(() => {
    console.log(
      "Post-build webpack bundling finished. Output:",
      path.join(outPath, "web-components.custom.js"),
    );
  });
});
