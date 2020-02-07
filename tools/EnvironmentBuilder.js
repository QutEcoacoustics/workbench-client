const fs = require("fs");
const environmentPath = "./dist/workbench-client/assets/environment";

buildEnvironment("staging");
buildEnvironment("production");

function buildEnvironment(stage) {
  path = `${environmentPath}.${stage}.json`;
  environment = { configUrl: `assets/config/${stage}.json` };

  try {
    const stat = fs.statSync(path);

    if (stat.isFile()) {
      fs.unlinkSync(path);
    }
  } catch (err) {}

  fs.writeFile(path, JSON.stringify(environment), err => {
    if (err) {
      return console.error(`Environment Builder (${stage}): `, err);
    }

    console.log(`Environment Builder (${stage}): Success`);
  });
}
