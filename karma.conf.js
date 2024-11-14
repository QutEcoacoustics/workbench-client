// Karma configuration file, see link for more information
// https://karma-runner.github.io/6.3/config/configuration-file.html

var maxSigned32BitInt = Math.pow(2, 31) - 1;

// GitHub Actions sets the CI environment variable to true
// see: https://github.blog/changelog/2020-04-15-github-actions-sets-the-ci-environment-variable-to-true
var isCi = process.env.CI === "true";
var isMacOS = process.platform === "darwin";

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular", "viewport"],
    plugins: [
      require("karma-jasmine"),
      require("karma-viewport"),
      require("karma-chrome-launcher"),
      require("karma-firefox-launcher"),
      require("@chiragrupani/karma-chromium-edge-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
      require("karma-junit-reporter"),
    ],
    client: {
      // clearContext will clear the context window (the iframe that the tests
      // run in) after each test completes
      //
      // clearContext has to be set to false when running tests on on
      // MacOS Chrome otherwise tests will fail with the error
      // "Some of your tests did a full page reload!"
      // see: https://github.com/karma-runner/karma/issues/3887
      clearContext: isMacOS,
    },
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "./coverage/workbench-client"),
      reports: ["html", "lcovonly", "text-summary", "cobertura"],
      fixWebpackSourcePaths: true,
    },
    // when running Karma locally, we do not want it to timeout
    // if we added a timeout to locally run tests, we would only have the
    // timeout duration of time to debug why the tests failed
    //
    // the timeout is a signed 32 bit integer and does not accept a JS Infinity
    // therefore, we set the timeout to the maximum signed 32 bit integer value
    // this gives us ~596 hours of time to debug the tests
    //
    // we reset the timeout to 30 seconds when running in CI so that CI tests
    // do not hang indefinitely due to a test failure
    browserDisconnectTimeout: isCi ? 30000 : maxSigned32BitInt,
    browserNoActivityTimeout: isCi ? 30000 : maxSigned32BitInt,
    browserDisconnectTolerance: 3,
    browserConsoleLogOptions: {
      level: "debug",
      format: "%b %T: %m",
      terminal: false,
    },
    reporters: ["progress", "kjhtml", "junit"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    restartOnFileChange: true,
    // serve these files through the karma server
    // by serving these files through the karma server we can fetch and test
    // against real files during testing
    files: [
      { pattern: "src/assets/test-assets/*", included: false, served: true },
      {
        // TODO: this should expose all of node_modules through the karma server
        // so that we can dynamically import anything from node_modules
        // without adding it to this list
        pattern: __dirname + "/node_modules/@ecoacoustics/web-components/**",
        included: false,
        served: true,
      },
    ],
    viewport: {
      // Ensure you modify the viewports object (@test/helpers/general.ts) to match
      // the values declared here.
      breakpoints: [
        // Bootstrap xs = 0 -> 539
        { name: "extra-small", size: { width: 500, height: 480 } },
        // Bootstrap s = 540 -> 719
        { name: "small", size: { width: 700, height: 720 } },
        // Bootstrap m = 750 -> 959
        { name: "medium", size: { width: 900, height: 1024 } },
        // Bootstrap l = 960 -> 1139
        { name: "large", size: { width: 1100, height: 1300 } },
        // Bootstrap xl = 1140 -> inf
        { name: "extra-large", size: { width: 1200, height: 1500 } },
      ],
    },
  });
};
