#!/usr/bin/env pwsh
#Requires -Version 7

# This function generates a list of version values for the current build

function Get-Version() {
    param(
        [Parameter(Mandatory = $false)]
        [string]
        $release_tag
    )
    
    $now = Get-Date
    $major = $now.ToString("yy")
    $minor = $now.ToString("MM")
    $patch = $now.ToString("dd")
    $describe = git describe --long
    $parts = $describe.split('-')
    $unique_hash = $parts[-1]
    $height = $parts[-2]
    $full_hash = git rev-parse --verify HEAD

    $pre_release = $height -gt 0 ? "-build$height" : ""
    # build must be metadata only, can't alter version meaning
    $tag = "$release_tag)."
    $build = "${tag}${unique_hash}"
    return @{
        Build           = $build
        Version         = "$major.$minor.${patch}${pre_release}"
        ShortHash       = "$unique_hash"
        LongHash        = "$full_hash"
        DescribeVersion = "$major.$minor.${patch}${pre_release}+${build}"
        DockerTag       = "$major.$minor.${patch}${pre_release}_${unique_hash}"
    }
}
