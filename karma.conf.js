// Karma configuration file, see link for more information
// https://karma-runner.github.io/6.3/config/configuration-file.html
// const angularConfig = require("./angular.json");
// const serverHeaders = angularConfig.projects["workbench-client"].architect.serve.options.headers;
//
// const customHeaders = [];
// for (const [key, value] of Object.entries(serverHeaders)) {
//   customHeaders.push({ [key]: value });
// }
var maxSigned32BitInt = Math.pow(2, 31) - 1;

// GitHub Actions sets the CI environment variable to true
// see: https://github.blog/changelog/2020-04-15-github-actions-sets-the-ci-environment-variable-to-true
var isCi = process.env.CI === "true";

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
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "./coverage/workbench-client"),
      reports: ["html", "lcovonly", "text-summary", "cobertura"],
      fixWebpackSourcePaths: true,
    },
    browserDisconnectTimeout: isCi ? 30000 : maxSigned32BitInt,
    browserNoActivityTimeout: isCi ? 3 : maxSigned32BitInt,
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
    // we add some headers to the Karma test server to ensure that we can use SharedArrayBuffer
    customHeaders: [
      { match: ".*", name: "Cross-Origin-Opener-Policy", value: "same-origin" },
      {
        match: ".*",
        name: "Cross-Origin-Embedder-Policy",
        value: "require-corp",
      },
      {
        match: ".*",
        name: "Cross-Origin-Resource-Policy",
        value: "cross-origin",
      },
      { match: ".*", name: "Access-Control-Allow-Origin", value: "*" },
    ],
    // serve these files through the karma server
    // by serving these files through the karma server we can fetch and test
    // against real files during testing
    files: [
      { pattern: "src/assets/test-assets/*", included: false, served: true },
      {
        pattern: __dirname + "/node_modules/@ecoacoustics/web-components/**",
        included: false,
        served: true,
      },
      {
        pattern: __dirname + "/node_modules/@ecoacoustics/web-components/assets/*",
        included: true,
        served: true,
      }
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
