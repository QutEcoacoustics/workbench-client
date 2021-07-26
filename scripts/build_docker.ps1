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

function Test-CI() {
  $env:CI -eq "true"
}

. $PSScriptRoot/exec.ps1
$version = . $PSScriptRoot/version.ps1 $release_tag

Write-Output $version

# tag version on github
if (Test-CI) {
  git config --global user.name "$github_actor"
  git config --global user.email "$github_actor@users.noreply.github.com"
}
exec { git tag -a $version.Version -m "Build (${version.DescribeVersion})" }

# docker containing and push to docker hub
exec {
  docker build `
    -t "qutecoacoustics/workbench-client:$release_tag" `
    -t "qutecoacoustics/workbench-client:$($version.DockerTag)" `
    . `
    --build-arg GIT_COMMIT=$version.LongHash `
    --build-arg WORKBENCH_CLIENT_VERSION=$version.DescribeVersion
}

docker push "qutecoacoustics/workbench-client:$release_tag"
docker push "qutecoacoustics/workbench-client:$($version.DockerTag)"

# push tag to github
git push origin --follow-tags "$($version.Version)"
