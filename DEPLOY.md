# MCSA Platform — Deploy in 5 Minutes

## What's Built
- 19-page Next.js 14 application (fully compiled, zero errors)
- Supabase backend: project `izqenzzlzuiqbyodvuxo` (already live with full schema + content)
- All 12 courses, modules, resources seeded in the database

## Step 1 — Extract the project
```bash
tar -xzf mcsa-complete.tar.gz
cd mcsa
```

## Step 2 — Install dependencies
```bash
npm install
```

## Step 3 — Deploy to Vercel
```bash
npm install -g vercel
vercel login          # opens browser to authenticate
vercel deploy --prod  # deploys and gives you a live URL
```

When prompted during `vercel deploy`:
- Set up and deploy? → **Y**
- Which scope? → select your team
- Link to existing project? → **N** (creates new)
- Project name? → **mcsa-platform**
- Directory? → **./** (current directory)
- Override settings? → **N**

## Step 4 — Set Environment Variables in Vercel Dashboard
Go to: vercel.com → mcsa-platform → Settings → Environment Variables

Add these two:
```
NEXT_PUBLIC_SUPABASE_URL
= https://izqenzzlzuiqbyodvuxo.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6cWVuenpsenVpcWJ5b2R2dXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MzMyOTEsImV4cCI6MjA5MjQwOTI5MX0.IgdFNnq7P7_Z7S1M_JKAwhgtjwOc43NyJohijKP1JxE
```

Then run `vercel deploy --prod` once more to pick them up.

## Step 5 — Set Your Domain
In Vercel Dashboard → mcsa-platform → Domains
Add: **municipalclaims.org** (or your preferred domain)

## Supabase Auth — Enable Email Signup
Go to: supabase.com → Project `mcsa-municipal-claims` → Authentication → Settings
- Enable "Email" provider ✓
- Set Site URL to your Vercel URL
- Set Redirect URLs to: https://your-vercel-url.vercel.app/**

## What's Live After Deployment
| Page | URL |
|------|-----|
| Homepage | / |
| Training Catalog | /training |
| Individual Course | /training/[slug] |
| Membership | /membership |
| Accreditation / CMCA | /accreditation |
| Resource Library | /resources |
| About | /about |
| Contact | /contact |
| Login | /login |
| Register | /register |
| Member Dashboard | /dashboard |
| My Courses | /dashboard/courses |
| Certifications | /dashboard/certifications |
| Resources (member) | /dashboard/resources |
| Account Settings | /dashboard/settings |
| Privacy Policy | /privacy |
| Terms of Use | /terms |

## Next Steps (Phase 2)
1. Connect Stripe for paid memberships (add STRIPE_SECRET_KEY env var)
2. Add Stripe webhook to update mcsa_memberships table
3. Upload actual SOP PDFs to Supabase Storage → update resource file_urls
4. Create admin panel at /admin for course/user management
5. Add municipalclaims.org domain in Vercel
