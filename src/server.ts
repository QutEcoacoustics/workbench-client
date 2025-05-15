/*
 * This is the server for the server side rendered (SSR) version of the app.
 * It is an express server that allows for rendering a page while the rest of
 * the application bundle downloads.
 */

import "reflect-metadata";
import "zone.js/node";

import { existsSync, readFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import {
  isMainModule,
  AngularNodeAppEngine,
  writeResponseToNodeResponse,
  createNodeRequestHandler,
} from "@angular/ssr/node";
import { assetRoot } from "@services/config/config.service";
import express from "express";
import { environment } from "src/environments/environment";
import { APP_BASE_HREF } from "@angular/common";
import angularConfig from "../angular.json";
import { REQUEST, RESPONSE } from "./express.tokens";

// The Express app is exported so that it can be used by serverless Functions.
export function app(path: string): express.Express {
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, "../browser");

  const server = express();
  const angularApp = new AngularNodeAppEngine();

  const configPath = [
    path,
    // default path for config in docker container
    "/environment.json",
    // development settings
    join(browserDistFolder, "assets", "environment.json"),
    "./src/assets/environment.json",
  ].find((x) => existsSync(x));

  // eslint-disable-next-line no-console
  console.log("Using config file ", configPath);
  const rawConfig = readFileSync(configPath, "utf-8");
  // const config = new Configuration(JSON.parse(rawConfig));
  // const apiConfig = { provide: API_CONFIG, useValue: config };

  server.set("view engine", "html");
  server.set("views", browserDistFolder);

  // we add the COOP and COEP headers so that we can use SharedArrayBuffer
  // if you want to update these headers, update the angular.json file
  // so that the headers are updated in the dev server as well
  server.use((_, res, next) => {
    // we use the angular.json config as the source of truth for headers
    // so that we don't have to maintain the same headers for both the dev
    // server and the production SSR server
    const serverHeaders =
      angularConfig.projects["workbench-client"].architect.serve.options
        .headers;
    for (const [key, value] of Object.entries(serverHeaders)) {
      res.setHeader(key, value);
    }

    next();
  });

  // special case rendering our settings file - we already have it loaded
  server.get(`${assetRoot}/environment.json`, (_request, response) => {
    response.type("application/json");
    response.send(rawConfig);
  });

  // Serve static files from /browser
  server.use(
    express.static(browserDistFolder, {
      maxAge: "1y",
      index: false,
      redirect: false,
    }),
  );

  // All regular routes use the Angular engine
  server.get("/**", (req, res, next) => {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");

    angularApp
      .handle(req, {
        // It is no longer "the Angular way" to declare providers in the express
        // ssr server.ts. The Angular team recommends that we should declare
        // these in the app.config.server
        // see: https://github.com/angular/angular-cli/issues/28727#issuecomment-2441176065
        //
        // However, they haven't documented a reliable way to provide all of the
        // DI tokens that we previously used.
        // Therefore, until we have better clarify on how to provide these
        // through the app.config.server, I will continue providing them through
        // the express server to not risk breaking these DI tokens.
        providers: [
          { provide: APP_BASE_HREF, useValue: req.baseUrl },
          { provide: RESPONSE, useValue: res },
          { provide: REQUEST, useValue: req },
        ],
      })
      .then((response) =>
        response ? writeResponseToNodeResponse(response, res) : next(),
      )
      .catch(next);
  });

  return server;
}

// first argument after this script's name
const configPath = process.argv[2];
const server = app(configPath);

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = Number(process.env.PORT) || 4000;

  // eslint-disable-next-line no-console
  console.log("Is production?", environment.production);

  server.listen(port, "0.0.0.0", () => {
    // eslint-disable-next-line no-console
    console.log(`Node Express server listening on http://0.0.0.0:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(server);
