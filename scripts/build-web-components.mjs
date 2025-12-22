import fs from "fs";
import path from "path";
import webpack from "webpack";
import baseConfig from "../webpack.config.mjs";

const dist = path.resolve("dist/web-components");

function findEntry() {
  const tryDirs = [
    "bundles",
    "fesm2020",
    "fesm2015",
    "fesm2022",
    "es2020",
    "es2015",
  ];
  for (const d of tryDirs) {
    const dir = path.join(dist, d);
    if (fs.existsSync(dir)) {
      const files = fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".js") || f.endsWith(".mjs"));
      if (files.length) return path.join(dir, files[0]);
    }
  }

  // fallback: any top-level js/mjs in dist
  if (fs.existsSync(dist)) {
    const rootFiles = fs
      .readdirSync(dist)
      .filter((f) => f.endsWith(".js") || f.endsWith(".mjs"));
    if (rootFiles.length) return path.join(dist, rootFiles[0]);
  }

  throw new Error(
    "No entry file found in dist/web-components (ng-packagr may not have built yet)",
  );
}

(async function run() {
  try {
    const entry = findEntry();
    console.log("Found NG-packagr entry:", entry);

    const outPath = dist;

    // Merge user webpack config with our runtime fields
    const config = {
      ...baseConfig,
      entry,
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
      }
      if (stats) {
        console.log(stats.toString({ colors: true, modules: false }));
      }
      compiler.close(() => {
        console.log(
          "Post-build webpack bundling finished. Output:",
          path.join(outPath, "web-components.custom.js"),
        );
      });
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
