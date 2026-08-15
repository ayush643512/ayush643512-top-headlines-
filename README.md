# Top Headlines

A futuristic PDF/document library. Visitors browse, read, search, and download
PDFs with no account required. Admins sign in to upload PDFs and images,
edit or delete documents, and view analytics.

## 1. Overview

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, React Three Fiber
- **Backend:** Next.js Route Handlers (`app/api/**`)
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage (`pdfs` and `images` buckets)
- **Auth:** Supabase Auth (email/password), admin-only

## 2. Technology Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15+, App Router, TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| 3D | Three.js / React Three Fiber |
| Icons | Lucide React |
| PDF viewer | react-pdf (pdf.js) |
| Charts | Recharts |
| Validation | Zod |
| DB + Storage + Auth | Supabase |

## 3. Local Installation

```bash
npm install
cp .env.example .env.local
# fill in .env.local with your Supabase project values (see section 4)
npm run dev
```

Visit `http://localhost:3000`.

## 4. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose to the browser)

## 5. Database Setup

1. Open **SQL Editor → New query** in your Supabase dashboard.
2. Paste the entire contents of `supabase/schema.sql` and run it.

This creates the `documents`, `downloads`, and `media` tables, full-text
search indexing, Row Level Security policies, an `increment_downloads`
function for the atomic download counter, and the storage buckets described
below.

## 6. Storage Bucket Setup

The schema script creates two **public** buckets automatically:

- `pdfs` — stores uploaded PDF files
- `images` — stores thumbnails and general media library images

Public read access lets visitors view/download without authentication;
write/delete access is restricted to authenticated admins via storage
policies in `schema.sql`. If you prefer to create the buckets manually
instead: **Storage → New bucket**, name them `pdfs` and `images`, mark both
"Public", then run just the policy statements from `schema.sql`.

## 7. Authentication Setup

Top Headlines uses Supabase Auth's email/password sign-in for admins. There
is no public sign-up — administrators are created manually (see section 12).

In **Authentication → URL Configuration**, set:
- **Site URL**: your production URL (e.g. `https://your-app.vercel.app`)
- **Redirect URLs**: add both your local (`http://localhost:3000`) and production URL

## 8. Environment Variables

Copy `.env.example` to `.env.local` for local dev, and add the same keys in
Vercel (**Project → Settings → Environment Variables**):

| Variable | Where used | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + server | Safe to expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + server | Safe to expose, respects RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only (`app/api/**`) | **Never** prefix with `NEXT_PUBLIC_`, never import into a Client Component |
| `NEXT_PUBLIC_SITE_URL` | Metadata, sitemap, OG tags | Set to your Vercel domain in production |

## 9. Running Locally

```bash
npm run dev
```

## 10. Building

```bash
npm run build
npm start
```

## 11. Deploying to Vercel

1. Push this project to a GitHub repository.
2. In Vercel, **Add New → Project → Import** the repository.
3. Framework preset: **Next.js** (auto-detected).
4. Add the four environment variables from section 8 under **Environment Variables**.
5. Click **Deploy**.
6. Once deployed, go back to Supabase **Authentication → URL Configuration**
   and set the Site URL / Redirect URLs to your production Vercel domain.
7. Visit `/admin/login` on the production URL and sign in as the admin you
   created in section 12.
8. Test uploading a PDF from `/admin/upload`.
9. Test opening it from `/documents/[id]`.
10. Test downloading it and confirm the download counter increments on `/admin/dashboard`.

Because all PDFs and images live in Supabase Storage (not the Vercel
filesystem), uploaded files persist across every redeploy.

## 12. Creating the First Admin

Supabase Auth has no public sign-up form for this app by design. Create the
first admin manually:

1. Supabase dashboard → **Authentication → Users → Add user**.
2. Enter an email and password, and confirm the user (skip email
   confirmation, or confirm via the email Supabase sends).
3. Sign in at `/admin/login` with those credentials.

To add more admins later, repeat this step — there's no separate "admin"
table; anyone with a confirmed Supabase Auth user is treated as an admin.

## 13. Uploading PDFs

1. Sign in at `/admin/login`.
2. Go to **Upload PDF** in the sidebar.
3. Drag a PDF in (or click to browse), fill in title, description,
   category, and optional keywords/thumbnail, then click **Upload PDF**.
4. The document appears immediately in **Manage Documents** and, if
   published, on the public `/documents` page.

## 14. Troubleshooting

| Symptom | Likely cause |
|---|---|
| "Invalid email or password" on login | Admin user not created/confirmed yet — see section 12 |
| Redirected to `/admin/login` in a loop | `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY` missing or wrong in the deployed environment |
| Upload fails with a generic error | Check the file is a real PDF under 25MB, and that the `pdfs` bucket + its policies were created (section 6) |
| PDF uploads but 404s when opened | Storage bucket isn't marked public, or storage policies weren't applied |
| Downloads don't increment | `increment_downloads` function missing — re-run `supabase/schema.sql` |
| Local dev can't reach Supabase | Double-check `.env.local` values match the SQL editor's project, not a different project |

## Project Structure

```
app/
  page.tsx                    Home
  documents/page.tsx           Document listing + search
  documents/[id]/page.tsx      PDF reader
  admin/login/page.tsx         Admin login
  admin/dashboard/page.tsx     Stats + downloads chart
  admin/upload/page.tsx        PDF upload form
  admin/documents/page.tsx     Document management table
  admin/media/page.tsx         Image library
  api/documents/               List/search, get/edit/delete by id, upload
  api/downloads/                Log + increment download counter
  api/media/                    List/delete, upload
components/                    Navbar, Hero, ThreeScene, DocumentCard, PdfViewer, Footer, SearchBar, AdminSidebar, UploadForm
lib/                           supabase.ts, supabase-server.ts, auth.ts, validations.ts
types/                         document.ts, media.ts
supabase/schema.sql            Full DB schema, RLS, storage buckets/policies
middleware.ts                  Protects /admin/* routes
```
