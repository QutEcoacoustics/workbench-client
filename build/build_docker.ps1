#!/usr/bin/pwsh

# builds and pushes a docker file to docker hub
# currently only builds the 'beta' tag, which is applied to whatever version
# is supplied to this script.

# get the current git commit
$GIT_LONG_COMMIT = git rev-parse --long HEAD
$GIT_SHORT_COMMIT = git rev-parse --short HEAD
$SHORT_VERSION = docker run --rm relizaio/versioning -s YYYY.0M.0D.Calvermodifier -i beta
$LONG_VERSION = docker run --rm relizaio/versioning -s YYYY.0M.0D.Calvermodifier+Metadata -i beta -m $GIT_SHORT_COMMIT

docker build `
  -t qutecoacoustics/workbench-client:beta `
  -t qutecoacoustics/workbench-client:latest `
  -t qutecoacoustics/workbench-client:$GIT_SHORT_COMMIT `
  -t qutecoacoustics/workbench-client:$SHORT_VERSION `
  . `
  --build-arg GIT_COMMIT=$GIT_LONG_COMMIT `
  --build-arg WORKBENCH_CLIENT_VERSION=$LONG_VERSION

# docker run -p 4000:4000 -v "$(pwd)/src/assets/environment.json:/environment.json" qutecoacoustics/workbench-client:beta
docker push --all-tags qutecoacoustics/workbench-client

git tag -a $SHORT_VERSION -m "Build $SHORT_VERSION"