#!/usr/bin/pwsh
#Requires -Version 7

# This script builds a docker image, publishes it to docker hub and tags the
# code on github

param(
  # github account name
  [Parameter(Mandatory = $true)]
  [string]
  $github_actor,
  # release tag
  [Parameter(Mandatory = $false)]
  [string]
  $release_tag = 'beta'
)

Import-Module $PSScriptRoot/version.ps1 -Force


$version = Get-Version $release_tag;

# tag version on github
git config --global user.name "$github_actor"
git config --global user.email "$github_actor@users.noreply.github.com"
git tag -a $version.Version -m "Build $($version.DescribeVersion)"

# docker containing and push to docker hub
docker build `
  -t qutecoacoustics/workbench-client:$release_tag `
  -t qutecoacoustics/workbench-client:$version.ShortHash `
  -t qutecoacoustics/workbench-client:$version.DockerTag `
  . `
  --build-arg GIT_COMMIT=$version.LongHash `
  --build-arg WORKBENCH_CLIENT_VERSION=$version.DescribeVersion

docker push --all-tags qutecoacoustics/workbench-client

# push tag to github
git push origin --tags