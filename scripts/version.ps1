#!/usr/bin/env pwsh
#Requires -Version 7

# This function generates a list of version values for the current build

param(
    [Parameter(Mandatory = $true)]
    [string]
    $release_tag
)

. $PSScriptRoot/exec.ps1

$now = Get-Date
$major = $now.ToString("yy")
$minor = $now.ToString("MM")
$patch = $now.ToString("dd")
$describe = exec { git describe --long --always }
$parts = $describe.split('-')
$height = 0
$unique_hash = $parts[-1].Trim('g')
$full_hash = exec { git rev-parse --verify HEAD }

$version = "$major.$minor.$patch"
# add build number if this is not the first tag with this version
$pre_release = ""
Write-Output "Checking if tag exists $describe"
if (git tag -l $version) {
  # because we use the date for the version, we can have multiple versions
  # with the same name
  # to fix this we add a "build" number to the version if a build tag of the
  # same version already exists
  # we keep incrementing the build number until we find the next build number
  # that has not been used
  while (git tag -l "$version-build$height") {
    $height++
  }
  $pre_release = "-build$height"
}

# build must be metadata only, can't alter version meaning
$tag = "$release_tag."
$build = "${tag}${unique_hash}"
return [PSCustomObject]@{
    # Unique build, compatible with any other Version
    Build           = $build
    # Git commit long hash
    LongHash        = "$full_hash"
    # Git commit short unique hash
    ShortHash       = "$unique_hash"
    # Calender version including pre-release
    Version         = "${version}${pre_release}"
    # Calender version including pre-release and build
    DescribeVersion = "${version}${pre_release}+${build}"
    # Calender version including pre-release and build
    DockerTag       = "${version}${pre_release}_${build}"
}
