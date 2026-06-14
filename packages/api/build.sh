#!/bin/bash
set -e

echo "Building shared package..."
cd ../shared
npm run build

echo "Building api package..."
cd ../api
npx nest build

echo "Build complete!"