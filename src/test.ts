// This file is required by karma.conf.js and loads recursively all the .spec and framework files
/// <reference types="karma-viewport" />

import "zone.js/testing";

import { getTestBed } from "@angular/core/testing";
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { mockGoogleNamespace } from "@test/helpers/googleMaps";
import { computedStyleMatchers } from "@test/matchers/computedStyle";
import { htmlMatchers } from "@test/matchers/html";
import { injectableMatchers } from "@test/matchers/injectables";
import { signalMatchers } from "@test/matchers/signals";
import { environment } from "./environments/environment";
import { applyMonkeyPatches } from "./patches/patches";

environment.testing = true;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

applyMonkeyPatches();

beforeEach(function () {
  // Load matchers into jasmine
  // https://stackoverflow.com/questions/11942085/is-there-a-way-to-add-a-jasmine-matcher-to-the-whole-environment
  jasmine.addMatchers(computedStyleMatchers);
  jasmine.addMatchers(injectableMatchers);
  jasmine.addMatchers(htmlMatchers);
  jasmine.addMatchers(signalMatchers);

  if (document.visibilityState !== "visible") {
    // Browsers when minimised optimise their behaviour in a way that can cause
    // issues in the assumptions of our tests. Ie. intersection and resize
    // observers will not trigger
    fail("Browser cannot be minimised when running these tests");
  }

  // Creating the Google namespace typically requires importing the Google maps
  // library through the CDN.
  // During testing, we don't want to keep making calls to the Google maps CDN
  // so we just mock the namespace.
  mockGoogleNamespace();
});

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting(),
);
