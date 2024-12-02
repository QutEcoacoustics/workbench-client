#!/usr/bin/env pwsh
#Requires -Version 7

# start new smoocker container
docker run -d -p 8080:8080 -p 8081:8081 --name smocker ghcr.io/smocker-dev/smocker

$smocker_endpoint = "http://localhost:8081/mocks"
$test_config_globs = "src/smocker-mocks/**/*.yml"
$test_config_files = Get-ChildItem -Path $test_config_globs -Recurse

# register each mock file with smocker
foreach ($path in $test_config_files) {
    $data_binary = "@$path"
    curl -XPOST --header "Content-Type: application/x-yaml" --data-binary $data_binary $smocker_endpoint
}
