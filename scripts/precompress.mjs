// Writes a .br and a .gz twin beside every text asset of the browser build. The server serves the
// twin to a client that accepts it (express.static with preCompressed: true), so nothing is
// compressed at request time. Run by npm after "build".
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";

const root = process.argv[2] ?? "dist/workbench-client/browser";
const textTypes = new Set([
  ".js",
  ".mjs",
  ".css",
  ".html",
  ".json",
  ".svg",
  ".txt",
  ".xml",
]);

let files = 0;
let raw = 0;
let brotli = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }
    if (!textTypes.has(extname(name))) {
      continue;
    }

    const data = readFileSync(path);
    const br = brotliCompressSync(data, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 11,
        [constants.BROTLI_PARAM_SIZE_HINT]: data.length,
      },
    });
    writeFileSync(`${path}.br`, br);
    writeFileSync(`${path}.gz`, gzipSync(data, { level: 9 }));

    files++;
    raw += data.length;
    brotli += br.length;
  }
}

walk(root);

const mb = (n) => (n / 1e6).toFixed(1);
console.log(
  `precompress: ${files} files, ${mb(raw)} MB -> ${mb(brotli)} MB brotli`,
);
