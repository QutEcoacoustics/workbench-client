// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const process = require("process");
process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular", "viewport"],
    plugins: [
      require("karma-jasmine"),
      require("karma-viewport"),
      require("karma-edge-launcher"),
      require("karma-chrome-launcher"),
      require("karma-firefox-launcher"),
      require("karma-edge-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage-istanbul-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
      require("karma-junit-reporter")
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "./coverage/workbench-client"),
      reports: ["html", "lcovonly", "text-summary", "cobertura"],
      fixWebpackSourcePaths: true
    },
    reporters: ["progress", "kjhtml", "junit"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome", "Firefox", "Edge"],
    singleRun: false,
    restartOnFileChange: true,
    viewport: {
      breakpoints: [
        {
          name: "extra-small",
          size: {
            width: 320,
            height: 480
          }
        },
        {
          name: "small",
          size: {
            width: 480,
            height: 720
          }
        },
        {
          name: "medium",
          size: {
            width: 768,
            height: 1024
          }
        },
        {
          name: "large",
          size: {
            width: 992,
            height: 1024
          }
        },
        {
          name: "extra-large",
          size: {
            width: 1200,
            height: 900
          }
        }
      ]
    }
  });
};
