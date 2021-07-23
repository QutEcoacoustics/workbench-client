#!/usr/bin/env pwsh

#Requires -Version 7

param(
    [Parameter(ParameterSetName = 'beta', Position = 0)]
    [switch]$beta
)

function Set-CiOutput($key, $value) {
    Write-Output "::set-output name=$key::$value"
}

function Test-CI() {
    $env:CI -eq "true"
}


$now = Get-Date
$major = $now.ToString("yy")
$minor =  $now.ToString("MM")
$patch = $now.ToString("dd")

$describe = git describe --long
$parts = $describe.split('-')
$unique_hash =  $parts[-1]
$height =  $parts[-2]
$full_hash = git rev-parse --verify HEAD


$pre_release = $height -gt 0 ? "-build$height" : ""
# build must be metadata only, can't alter version meaning
$tag = $beta  ? "beta." : ""
$build = "${tag}${unique_hash}"

$data = @{
    Build = $build
    Version = "$major.$minor.${patch}${pre_release}"
    ShortHash = "$unique_hash"
    LongHash = "$full_hash"
    DescribeVersion = "$major.$minor.${patch}${pre_release}+${build}"
    DockerTag =  "$major.$minor.${patch}${pre_release}_${unique_hash}"
}

foreach($key in $data.Keys) {
    $value = $data[$key]
    Write-Output "$key is $value"
    if (Test-CI) { 
        Set-CiOutput($key, $value)
    }
    Set-Content Env:$key -Value $value
}