// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

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
      require("karma-coverage-istanbul-reporter"),
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
    reporters: ["progress", "kjhtml", "junit"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    restartOnFileChange: true,
    viewport: {
      breakpoints: [
        {
          name: "extra-small",
          size: {
            width: 575, // Bootstrap xs = 0 -> 575
            height: 480,
          },
        },
        {
          name: "small",
          size: {
            width: 767, // Bootstrap s = 576 -> 767
            height: 720,
          },
        },
        {
          name: "medium",
          size: {
            width: 991, // Bootstrap m = 768 -> 991
            height: 1024,
          },
        },
        {
          name: "large",
          size: {
            width: 1199, // Bootstrap l = 992 -> 1199
            height: 1024,
          },
        },
        {
          name: "extra-large",
          size: {
            width: 1200, // Bootstrap xl = 1200 -> inf
            height: 900,
          },
        },
      ],
    },
  });
};
