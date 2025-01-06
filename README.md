# MiniJournal

A minimalistic journaling app with mood tracking.

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in the Supabase credentials:
   - Go to your Supabase project dashboard
   - Click on the "Settings" icon in the sidebar
   - Go to "API" under Project Settings
   - Copy the "Project URL" to `VITE_SUPABASE_URL`
   - Copy the "anon" public key to `VITE_SUPABASE_ANON_KEY`

## Google Authentication Setup

1. Create OAuth credentials in Google Cloud Console:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized origins:
     ```
     https://[YOUR_SUPABASE_PROJECT].supabase.co
     http://localhost:5173
     ```
   - Add authorized redirect URIs:
     ```
     https://[YOUR_SUPABASE_PROJECT].supabase.co/auth/v1/callback
     http://localhost:5173/auth/v1/callback
     ```

2. Configure Supabase Auth:
   - Go to your Supabase Dashboard
   - Navigate to Authentication > Providers
   - Find and enable Google OAuth
   - Enter your Google Client ID and Secret
   - Save changes

## Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Features

- ✍️ Minimalistic journal entries
- 🎭 Mood tracking with icons
- 📅 Calendar view of entries
- 🔄 Real-time auto-saving
- 🔒 Secure Google authentication
- 📱 Responsive design
