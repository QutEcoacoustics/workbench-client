#!/usr/bin/pwsh

# builds and pushes a docker file to docker hub
# currently only builds the 'beta' tag, which is applied to whatever version
# is supplied to this script.

# get the current git commit
$GIT_LONG_COMMIT = git rev-parse --long HEAD
$GIT_SHORT_COMMIT = git rev-parse --short HEAD
$VERSION = docker run --rm relizaio/versioning -s YYYY.0M.Calvermodifier.Micro_Metadata -i beta -m $GIT_SHORT_COMMIT

docker build `
  -t qutecoacoustics/workbench-client:beta `
  -t qutecoacoustics/workbench-client:latest `
  -t qutecoacoustics/workbench-client:$VERSION `
  . `
  --build-arg GIT_COMMIT=$GIT_LONG_COMMIT `
  --build-arg WORKBENCH_CLIENT_VERSION=$VERSION

# docker run -p 4000:4000 -v "$(pwd)/src/assets/environment.json:/environment.json" qutecoacoustics/workbench-client:beta
docker push qutecoacoustics/workbench-client:beta