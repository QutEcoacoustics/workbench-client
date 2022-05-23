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

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

beforeEach(function () {
  // Load matchers into jasmine
  // https://stackoverflow.com/questions/11942085/is-there-a-way-to-add-a-jasmine-matcher-to-the-whole-environment
  jasmine.addMatchers(computedStyleMatchers);

  if (document.visibilityState !== "visible") {
    // Browsers when minimised optimise their behaviour in a way that can cause
    // issues in the assumptions of our tests. Ie. intersection and resize
    // observers will not trigger
    fail("Browser cannot be minimised when running these tests");
  }
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
