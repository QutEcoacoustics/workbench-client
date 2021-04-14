// Karma configuration file, see link for more information
// https://karma-runner.github.io/6.3/config/configuration-file.html

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
    browserDisconnectTimeout: 30000,
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
    viewport: {
      // Ensure you modify the viewports object (@test/helpers/general.ts) to match
      // the values declared here.
      breakpoints: [
        // Bootstrap xs = 0 -> 575
        { name: "extra-small", size: { width: 575, height: 480 } },
        // Bootstrap s = 576 -> 767
        { name: "small", size: { width: 767, height: 720 } },
        // Bootstrap m = 768 -> 991
        { name: "medium", size: { width: 991, height: 1024 } },
        // Bootstrap l = 992 -> 1199
        { name: "large", size: { width: 1199, height: 1300 } },
        // Bootstrap xl = 1200 -> inf
        { name: "extra-large", size: { width: 1200, height: 1500 } },
      ],
    },
  });
};
