#!/bin/bash
# MCSA Platform — One-Command Deploy Script
# Run this from the folder where you extracted mcsa-complete.tar.gz

set -e
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   MCSA Platform — GitHub Push & Deploy   ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Step 1: Create GitHub repo via gh CLI or prompt
if command -v gh &> /dev/null; then
  echo "✓ GitHub CLI found — creating repo..."
  gh repo create awisecoho/mcsa-platform --public --source=./mcsa --remote=origin --push
  echo "✓ Code pushed to GitHub!"
else
  echo "GitHub CLI not found. Creating repo manually..."
  echo ""
  echo "1. Go to: https://github.com/new"
  echo "2. Repository name: mcsa-platform"
  echo "3. Set to Public, click Create"
  echo "4. Then run:"
  echo ""
  echo "   cd mcsa"
  echo "   git remote add origin https://github.com/awisecoho/mcsa-platform.git"
  echo "   git push -u origin master"
  echo ""
  read -p "Press ENTER once you've pushed to GitHub..."
fi

# Step 2: Vercel deploy
echo ""
echo "Deploying to Vercel..."
cd mcsa
if ! command -v vercel &> /dev/null; then
  npm install -g vercel
fi

vercel deploy --prod \
  --env NEXT_PUBLIC_SUPABASE_URL="https://izqenzzlzuiqbyodvuxo.supabase.co" \
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6cWVuenpsenVpcWJ5b2R2dXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MzMyOTEsImV4cCI6MjA5MjQwOTI5MX0.IgdFNnq7P7_Z7S1M_JKAwhgtjwOc43NyJohijKP1JxE"

echo ""
echo "✓ MCSA Platform is LIVE!"
