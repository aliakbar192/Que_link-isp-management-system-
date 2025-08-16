#!/bin/bash

echo "🚀 Starting ISP Billing Backend..."

# Check if MongoDB is running
echo "📊 Checking MongoDB connection..."
if ! nc -z localhost 27017; then
    echo "❌ MongoDB is not running. Please start MongoDB first."
    echo "   You can start MongoDB with: sudo systemctl start mongod"
    exit 1
fi

echo "✅ MongoDB is running"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the application
echo "🔥 Starting NestJS application..."
npm run start:dev