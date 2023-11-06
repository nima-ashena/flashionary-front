#!/bin/bash

echo "git pull..."
git checkout master
git pull origin master

echo "build react..."
npm run build

echo "update done!"
