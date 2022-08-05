/*
 * This is the server for the Angular Universal version of the app.
 * It is an express server that allows for rendering a page while the rest of
 * the application bundle downloads.
 */

import "reflect-metadata";
import "zone.js/node";

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { APP_BASE_HREF } from "@angular/common";
import { Configuration } from "@helpers/app-initializer/app-initializer";
import { ngExpressEngine } from "@nguniversal/express-engine";
import { assetRoot } from "@services/config/config.service";
import express from "express";
import { environment } from "src/environments/environment";
import { API_CONFIG } from "@services/config/config.tokens";
import { AppServerModule } from "./src/main.server";

// The Express app is exported so that it can be used by serverless Functions.
export function app(path: string): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), "dist/workbench-client/browser");
  const indexHtml = existsSync(join(distFolder, "index.original.html"))
    ? "index.original.html"
    : "index";

  const configPath = [
    path,
    // default path for config in docker container
    "/environment.json",
    // development settings
    join(distFolder, "assets", "environment.json"),
  ].find((x) => existsSync(x));

  // eslint-disable-next-line no-console
  console.log("Using config file ", configPath);
  const rawConfig = readFileSync(configPath, "utf-8");
  const config = new Configuration(JSON.parse(rawConfig));
  const apiConfig = { provide: API_CONFIG, useValue: config };

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    "html",
    ngExpressEngine({
      bootstrap: AppServerModule,
      // a similar provider exists in main.ts
      providers: [apiConfig],
    })
  );

  server.set("view engine", "html");
  server.set("views", distFolder);

  /*
   * This allows us to reduce the chances of click-jacking by ensuring that the
   * site cannot be embedded into another site
   */
  server.get("*", (_, res, next) => {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    next();
  });

  // special case rendering our settings file - we already have it loaded
  server.get(`${assetRoot}/environment.json`, (request, response) => {
    response.type("application/json");
    response.send(rawConfig);
  });

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    "*.*",
    express.static(distFolder, {
      maxAge: "1y",
    })
  );

  // All regular routes use the Universal engine
  server.get("*", (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }, apiConfig],
    });
  });

  return server;
}

function run(configPath: string): void {
  const port = Number(process.env.PORT) || 4000;

  // eslint-disable-next-line no-console
  console.log("Is production?", environment.production);
  // Start up the Node server
  const server = app(configPath);
  server.listen(port, "0.0.0.0", () => {
    // eslint-disable-next-line no-console
    console.log(`Node Express server listening on http://0.0.0.0:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || "";
if (moduleFilename === __filename || moduleFilename.includes("iisnode")) {
  // first argument after this script's name
  run(process.argv[2]);
}

export * from "./src/main.server";
