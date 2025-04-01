#!/bin/sh

echo "📦 Installing dependencies..."
npm install

echo "🔁 Running migrations..."
npm run migration:run

echo "🚀 Starting backend..."
npm run start:dev
