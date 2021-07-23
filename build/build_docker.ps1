#!/usr/bin/pwsh

param(
  # user name
  [Parameter(Mandatory = $true)]
  [string]
  $github_actor,
  # release tag
  [Parameter(Mandatory = $false)]
  [string]
  $release_tag = "beta"
)

# builds and pushes a docker file to docker hub
# this also tags the build on github

# get the current git commit
$GIT_LONG_COMMIT = git rev-parse --long HEAD
$GIT_SHORT_COMMIT = git rev-parse --short HEAD

# generate calender version for build following the format specified here:
# https://github.com/relizaio/versioning#25-known-version-elements
$SHORT_VERSION = docker run --rm relizaio/versioning -s "YYYY.0M.0D.CALVERMODIFIER_CIBUILD" -i $release_tag
$LONG_VERSION = docker run --rm relizaio/versioning -s "YYYY.0M.0D.CALVERMODIFIER_CIBUILD+METADATA" -i $release_tag -m $GIT_SHORT_COMMIT

# tag version on github
git config --global user.name "$($github_actor)"
git config --global user.email "$($github_actor)@users.noreply.github.com"
git tag -a $SHORT_VERSION -m "Build $SHORT_VERSION"

# docker containing and push to docker hub
docker build `
  -t qutecoacoustics/workbench-client:$release_tag `
  -t qutecoacoustics/workbench-client:$GIT_SHORT_COMMIT `
  -t qutecoacoustics/workbench-client:$SHORT_VERSION `
  . `
  --build-arg GIT_COMMIT=$GIT_LONG_COMMIT `
  --build-arg WORKBENCH_CLIENT_VERSION=$LONG_VERSION

docker push --all-tags qutecoacoustics/workbench-client

# push docker tag to github

git push origin --tags
