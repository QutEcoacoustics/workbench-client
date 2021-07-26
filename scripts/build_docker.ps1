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
Write-Output "Create git tag"
if (Test-CI) {
  git config --global user.name "$github_actor"
  git config --global user.email "$github_actor@users.noreply.github.com"
}
$git_tag_name = $version.Version
$git_tag_message = [string]::Format("Build {0}", $version.DescribeVersion);
exec { git tag -a "$git_tag_name" -m "$git_tag_message" }

# docker containing and push to docker hub
Write-Output "Build docker container"
$docker_name = "qutecoacoustics/workbench-client";
$docker_release_tag = [string]::Format("{0}:{1}", $docker_name, $release_tag);
$docker_version_tag = [string]::Format("{0}:{1}", $docker_name, $version.DockerTag);

exec {
  docker build `
    -t "$docker_release_tag" `
    -t "$docker_version_tag" `
    . `
    --build-arg GIT_COMMIT="$($version.LongHash)" `
    --build-arg WORKBENCH_CLIENT_VERSION="$($version.DescribeVersion)"
}

Write-Output "Push docker image"
exec { docker push "$docker_release_tag" }
exec { docker push "$docker_version_tag" }

# push tag to github
Write-Output "Push git tag"
git push origin --follow-tags "$git_tag_name"
