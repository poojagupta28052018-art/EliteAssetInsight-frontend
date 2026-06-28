# EliteAssetInsight — Frontend

Next.js frontend for EliteAssetInsight.com (MVP scaffold).

This repo contains a minimal Next.js (TypeScript) app using the App Router. It includes example pages (Home, Listings, Membership, About, Contact) and a simple Supabase client integration placeholder. Replace environment variables in .env.local and connect to Vercel for deployment.

PayPal integration

The project now uses PayPal for payments. Configure PAYPAL_CLIENT_ID and PAYPAL_SECRET in your deployment environment. Webhook endpoint: /api/webhooks/paypal

Setup

1. Install dependencies:

   npm install

2. Create a local .env.local from .env.example and fill in keys for Supabase and PayPal.

3. Run the dev server:

   npm run dev

Deploy

- Connect this repository to Vercel and set environment variables in the Vercel dashboard.
