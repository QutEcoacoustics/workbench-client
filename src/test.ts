// This file is required by karma.conf.js and loads recursively all the .spec and framework files
/// <reference types="karma-viewport" />

import "zone.js/testing";

import { getTestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

// Then we find all the tests.
const context = require.context(
  "./",
  true,
  /strong-route\.directive\.spec\.ts$/
);
// And load the modules.
context.keys().map(context);
