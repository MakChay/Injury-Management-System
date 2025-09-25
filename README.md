DUT Athletic Injury Management (React + Supabase)

A full-stack web app for Durban University of Technology student-athletes to report injuries, get assigned to practitioners, track recovery, chat, upload files, and manage appointments.

Tech Stack
- Frontend: React (Vite, TypeScript), Tailwind CSS, Framer Motion
- Backend: Supabase (Auth, Postgres, RLS, Realtime, Storage)

Getting Started
1. Copy env variables
```
cp .env.example .env
```
Fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase project.

2. Install dependencies
```
npm install
```

3. Run dev server
```
npm run dev
```

The app runs in mock mode when `.env` is not set; with `.env` configured it uses Supabase.

Database Schema & Policies
Run the SQL in `supabase/schema.sql` in your Supabase SQL editor. It creates tables and RLS policies for students, practitioners, and admins.

Roles
- Students: report injuries, view progress, book appointments, message practitioners
- Practitioners: manage assigned athletes, add recovery logs
- Admins: manage users, assign practitioners, view analytics

Project Structure
- `src/lib/supabase.ts`: Supabase client and types; feature flags
- `src/hooks/useAuth.ts`: Auth hook (Supabase or mock fallback)
- `src/pages/*`: Route pages for each role and feature
- `src/components/*`: UI components

Notes
- Realtime messaging and file uploads are scaffolded; wire Supabase Realtime and Storage as needed.
- Charts and analytics use mock data; replace with SQL queries or RPCs.

