#!/bin/bash

echo "Install dependencies"
sudo apt install pngcheck

echo "Retrieve home page"
wget http://localhost:4000
echo "Validate title"
grep -o "<title>&lt;&lt;brandName&gt;&gt;</title>" index.html
echo "Validate routing"
grep -o "<\/router-outlet><baw-home.*<\/baw-home>" index.html
echo "Validate footer contains version"
grep -o -P "id=\"version\".+?>\d{2}\.\d{1,2}\.\d{1,2}.+?<\/p>" index.html

echo "Retrieve main.js"
grep -o -P "main-es2015\..+?\.js" index.html | sed -e 's/^/http:\/\/localhost:4000\//' | xargs wget
grep -o -P "version:\"\d{2}\.\d{1,2}\.\d{1,2}.+?\"" main-*.js

echo "Retrieve not found page"
wget http://localhost:4000/broken.html
echo "Validate not found page"
grep -o "<h1>Not Found</h1>" broken.html

echo "Retrieve LFS file from assets"
wget http://localhost:4000/assets/images/project/project_span4.png
echo "Validate LFS asset is instantiated"
grep -o -v "git-lfs" project_span4.png
echo "Validate PNG asset is uncorrupted"
pngcheck project_span4.png
