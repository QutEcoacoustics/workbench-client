// This file is required by karma.conf.js and loads recursively all the .spec and framework files
/// <reference types="karma-viewport" />

import "zone.js/testing";

import { getTestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { computedStyleMatchers } from "@test/matchers/toHaveComputedStyle";

declare const require: any;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

// Load matchers into jasmine
// https://stackoverflow.com/questions/11942085/is-there-a-way-to-add-a-jasmine-matcher-to-the-whole-environment
beforeEach(function () {
  jasmine.addMatchers(computedStyleMatchers);
});

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Then we find all the tests.
const context = require.context("./", true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
