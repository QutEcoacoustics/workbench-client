#!/bin/bash

function info() {
  BLUE='\033[0;36m'
  NC='\033[0m' # No Color
  echo -e "${BLUE}$1${NC}"
}

function error() {
  RED='\033[0;31m'
  NC='\033[0m' # No Color
  echo -e "${RED}$1${NC}"
}

function success() {
  GREEN='\033[0;32m'
  NC='\033[0m' # No Color
  echo -e "${GREEN}$1${NC}"
}

function retrieve_page() {
  wget "http://localhost:4000/$1"
}

function page_contains() {
  if !(grep -o -P $1 $2) then
    error "\tTest failed"
    exit 1
  else
    success "\tTest passed"
  fi
}

function page_does_not_contain() {
  if !(grep -v -o -P $1 $2) then
    error "\tTest failed"
    exit 1
  else
    success "\tTest passed"
  fi
}

info "Install dependencies"
sudo apt install pngcheck

info "Retrieve home page"
retrieve_page
info "Validate title"
page_contains "<title>&lt;&lt;brandName&gt;&gt;</title>" index.html
info "Validate routing"
page_contains "<\/router-outlet><baw-home.*<\/baw-home>" index.html
info "Validate footer contains version"
page_contains "id=\"version\".+?>\d{2}\.\d{1,2}\.\d{1,2}.+?<\/p>" index.html

info "Retrieve main.js"
grep -o -P "main-es2015\..+?\.js" index.html | xargs retrieve_page
page_contains "version:\"\d{2}\.\d{1,2}\.\d{1,2}.+?\"" main-*.js

info "Retrieve not found page"
retrieve_page broken.html
info "Validate not found page"
page_contains "<h1>Not Found</h1>" broken.html

info "Retrieve LFS file from assets"
retrieve_page assets/images/project/project_span4.png
info "Validate LFS asset is instantiated"
page_does_not_contain "git-lfs" project_span4.png
info "Validate PNG asset is uncorrupted"
pngcheck project_span4.png
