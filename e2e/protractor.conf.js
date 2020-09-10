// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter, StacktraceOption } = require("jasmine-spec-reporter");
const reporters = require("jasmine-reporters");

const chromeOptions = {
  args: [
    "--headless",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--window-size=1200,900", //Window size is bootstrap extra-large
  ],
};

// Windows specific binary (issue #448)
if (process.platform === "win32") {
  chromeOptions["binary"] =
    "C:/Program Files/Google/Chrome/Application/chrome.exe";
}

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 11000,
  specs: ["./src/**/*.e2e-spec.ts"],
  capabilities: {
    browserName: "chrome",
    chromeOptions,
  },
  directConnect: true,
  baseUrl: "http://localhost:4200/",
  framework: "jasmine",
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () {},
  },
  onPrepare() {
    require("ts-node").register({
      project: require("path").join(__dirname, "../tsconfig.e2e.json"),
    });
    const jUnitReporter = new reporters.JUnitXmlReporter({
      savePath: "./",
      consolidateAll: true,
    });
    const specReporter = new SpecReporter({
      spec: { displayStacktrace: StacktraceOption.PRETTY },
    });
    jasmine.getEnv().addReporter(jUnitReporter);
    jasmine.getEnv().addReporter(specReporter);
  },
};
