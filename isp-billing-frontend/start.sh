#!/bin/bash

echo "🚀 Starting ISP Billing Frontend..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the React application
echo "🔥 Starting React application..."
npm start