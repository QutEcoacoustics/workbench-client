#!/usr/bin/pwsh

param(
  # user name
  [Parameter(Mandatory = $true)]
  [string]
  $github_actor 
)

# builds and pushes a docker file to docker hub
# currently only builds the 'beta' tag, which is applied to whatever version
# is supplied to this script.
# this also tags the build on github

# get the current git commit
$GIT_LONG_COMMIT = git rev-parse --long HEAD
$GIT_SHORT_COMMIT = git rev-parse --short HEAD

# generate calender version for build following the format specified here:
# https://github.com/relizaio/versioning#25-known-version-elements
$SHORT_VERSION = docker run --rm relizaio/versioning -s "YYYY.0M.0D.Calvermodifier" -i beta
$LONG_VERSION = docker run --rm relizaio/versioning -s "YYYY.0M.0D.Calvermodifier+Metadata" -i beta -m $GIT_SHORT_COMMIT

# tag version on github
git tag -a $SHORT_VERSION -m "Build $SHORT_VERSION"

# docker containing and push to docker hub
docker build `
  -t qutecoacoustics/workbench-client:beta `
  -t qutecoacoustics/workbench-client:$GIT_SHORT_COMMIT `
  -t qutecoacoustics/workbench-client:$SHORT_VERSION `
  . `
  --build-arg GIT_COMMIT=$GIT_LONG_COMMIT `
  --build-arg WORKBENCH_CLIENT_VERSION=$LONG_VERSION

docker push --all-tags qutecoacoustics/workbench-client

# push docker tag to github

git config --global user.name "$($github_actor)"
git config --global user.email "$($github_actor)@users.noreply.github.com"
git push origin $SHORT_VERSION
