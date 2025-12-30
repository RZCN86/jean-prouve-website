#!/bin/bash

# Jean Prouvé Website Deployment Script
# This script helps with deploying the website to Vercel

set -e

echo "🚀 Starting deployment process for Jean Prouvé Website..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "npm i -g vercel"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json not found. Please ensure the Vercel configuration exists."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm run test

# Run linting
echo "🔍 Running linter..."
npm run lint

# Build the project
echo "🏗️  Building the project..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."

# Check if this is a production deployment
if [ "$1" = "--production" ] || [ "$1" = "-p" ]; then
    echo "🚀 Deploying to production..."
    vercel --prod
else
    echo "🔧 Deploying to preview..."
    vercel
fi

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Check the deployment URL provided by Vercel"
echo "2. Verify all functionality works correctly"
echo "3. Configure custom domain if needed"
echo "4. Set up monitoring and analytics"
echo ""
echo "🔗 Useful commands:"
echo "  vercel --prod          # Deploy to production"
echo "  vercel domains         # Manage domains"
echo "  vercel env             # Manage environment variables"
echo "  vercel logs            # View deployment logs"