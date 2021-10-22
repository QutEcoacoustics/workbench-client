#!/usr/bin/pwsh
#Requires -Version 7

function Format-Output {
  param(
    [Parameter()][string]$color,
    [Parameter()][string]$msg
  )
  $noColor = "`e[0m"
  Write-Output "$color$msg$noColor"
}

function Format-Info {
  param([Parameter()][string]$msg)
  Format-Output "`e[0;36m" $msg
}

function Format-Error {
  param([Parameter()][string]$msg)
  Format-Output "`e[0;31m" $msg
}

function Format-Success {
  param([Parameter()][string]$msg)
  Format-Output "`e[0;32m" $msg
}

function Get-Page {
  param(
    [Parameter()][string]$route,
    [Parameter()][string]$outFile
  )
  Invoke-WebRequest -OutFile $outFile "http://localhost:4000/$route"
}

function Assert-Contains {
  param(
    [Parameter()][string]$pattern,
    [Parameter()][string]$file
  )

  if (Select-String -Pattern $pattern -Path $file) {
    Format-Success "`tTest passed"
  } else {
    Format-Error "`tTest failed"
    Exit 1
  }
}

function Assert-NotContains {
  param(
    [Parameter()][string]$pattern,
    [Parameter()][string]$file
  )

  if (Select-String -Pattern $pattern -Path $file) {
    Format-Error "`tTest failed"
    Exit 1
  } else {
    Format-Success "`tTest passed"
  }
}

function Assert-Image {
  param([Parameter()][string]$file)
  
  if (pngcheck $imageFile) {
    Format-Success("`tTest passed")
  } else {
    Format-Error("`tTest failed")
    Exit 1 
  }  
}

# TODO Replace this dependency with cross-platform solution
Format-Info "Install dependencies"
sudo apt install pngcheck

# Home page tests
Format-Info "Retrieve home page"
$indexFile = "index.html"
Get-Page "" $indexFile
Format-Info "Validate title"
Assert-Contains "<title>&lt;&lt;brandName&gt;&gt;</title>" $indexFile
Format-Info "Validate routing"
Assert-Contains "<\/router-outlet><baw-home.*<\/baw-home>" $indexFile
Format-Info "Validate footer contains version"
Assert-Contains "id=`"version`".+?>\d{2}\.\d{1,2}\.\d{1,2}.+?<\/p>" $indexFile

# Not found page tests
Format-Info "Retrieve not found page"
$brokenFile = "broken.html"
Get-Page "broken.html" $brokenFile
Format-Info "Validate not found page"
Assert-Contains "<h1>Not Found<\/h1>" $brokenFile

# Tests for angular production build
Format-Info "Retrieve angular bundle"
$bundleFile = "main.js"
Get-Page $((Select-String -Pattern "main-es2015\..+?\.js" -Path $indexFile).Matches.Value) $bundleFile
Format-Info "Validate footer contains version"
Assert-Contains "version:`"\d{2}\.\d{1,2}\.\d{1,2}.+?`"" $bundleFile

# Tests to validate LFS instantiated correctly
Format-Info "Retrieve LFS file from assets"
$imageFile = "image.png"
Get-Page "assets/images/project/project_span4.png" $imageFile
Format-Info "Validate LFS asset is instantiated"
Assert-NotContains "git-lfs" $imageFile
Format-Info "Validate PNG asset is uncorrupted"
Assert-Image $imageFile
