# JobPing

> ⚡ A lightweight Upwork job feed web app — filter jobs by keyword, track matches, and get notified.

## Features

- 📋 **Job Feed Dashboard** — Browse mock Upwork jobs sorted by match score
- 🎯 **Keyword Filters** — Include/exclude keywords and watched job titles
- 💾 **localStorage Persistence** — Filters saved automatically across sessions
- 📱 **Mobile-First UI** — Dark mode, bottom navigation on mobile
- 🔔 **Notification Settings** — UI-ready for future alert configuration
- 📲 **PWA Ready** — Installable with manifest and service worker scaffold
- 🔗 **Upwork OAuth Scaffold** — Ready to connect when you have an API key

## Pages

| Route | Description |
|---|---|
| `/` | Dashboard — job feed with filter panel |
| `/saved-filters` | View and clear your saved filter settings |
| `/notifications` | Notification preferences (UI only) |
| `/api/auth/upwork/callback` | Upwork OAuth callback route scaffold |

## Getting Started

```bash
# Install dependencies
npm install

# Copy and configure env vars
cp .env.example .env.local
# Edit .env.local with your Upwork credentials

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Upwork OAuth Setup

When you are ready to connect to the Upwork API:

1. Apply for a key at: https://www.upwork.com/developer/keys/apply
2. Set the callback URL to:
   ```
   http://localhost:3000/api/auth/upwork/callback
   ```
3. Add the credentials to `.env.local`:
   ```
   UPWORK_CLIENT_ID=your_key
   UPWORK_CLIENT_SECRET=your_secret
   UPWORK_REDIRECT_URI=http://localhost:3000/api/auth/upwork/callback
   ```
4. Fill in the `TODO` in `src/app/api/auth/upwork/callback/route.ts` to exchange the OAuth token for an access token.

## Project Structure

```
jobping/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Dashboard
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css
│   │   ├── saved-filters/page.tsx      # Saved Filters
│   │   ├── notifications/page.tsx      # Notification settings
│   │   └── api/auth/upwork/callback/
│   │       └── route.ts                # Upwork OAuth callback
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── JobCard.tsx
│   │   ├── FiltersPanel.tsx
│   │   └── ServiceWorkerRegistrar.tsx
│   ├── hooks/
│   │   └── useLocalStorage.ts
│   └── lib/
│       ├── types.ts                    # Shared types
│       └── mockData.ts                 # Mock Upwork jobs
├── public/
│   ├── manifest.json                   # PWA manifest
│   └── sw.js                          # Service worker scaffold
├── .env.example
└── README.md
```

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **localStorage** for client-side persistence
- **Mock data** for development

## What's NOT Included (By Design)

- ❌ Database
- ❌ Real Upwork API calls
- ❌ Auto-apply
- ❌ User login/auth for this app
- ❌ Admin panel
