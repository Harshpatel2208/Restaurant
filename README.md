# Restaurant App

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start frontend + backend together:

```bash
npm run dev
```

This uses Vite proxy to forward `/api/*` to `http://localhost:5000` in local development.

## Deployment Setup (Important)

The frontend now reads API URLs from `VITE_API_BASE_URL`.

- Local development: keep it unset and Vite proxy handles `/api`.
- Production (Vercel/Netlify): set `VITE_API_BASE_URL` to your deployed backend base URL.

Example:

```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

If this value is missing in production and your API is not hosted on the same domain under `/api`, reservation and admin API calls will fail.
