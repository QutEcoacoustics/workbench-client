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
$height = [int]$parts[-2]
$unique_hash = $parts[-1].Trim('g')
$full_hash = exec { git rev-parse --verify HEAD }

$version = "$major.$minor.$patch"

# add build number if this is not the first tag with this version
$pre_release = ""
if ((git tag -l $version) -and ($height -gt 0)) {
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