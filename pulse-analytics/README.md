# Pulse Analytics 📈

> A production-grade Social Media Analytics SaaS dashboard built with Next.js 16.

**Pulse Analytics** is a unified dashboard that aggregates metrics from Instagram, TikTok, YouTube, Facebook, LinkedIn (and custom platforms). It features real-time charts, global date filtering, full dark mode, and an AI insights engine.

---

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router) & React 19
- **Styling:** Tailwind CSS v4 & Material Design 3 UI tokens
- **Database:** Prisma ORM with PostgreSQL (Neon) ✅ Migrated from SQLite
- **Authentication:** NextAuth.js v5 (Dev bypass mode — Google OAuth pending)
- **State Management:** Zustand (Global Date Range & Theme persistence)
- **Data Fetching:** TanStack Query (React Query) for client-side data
- **Charts:** Recharts
- **Icons:** Material Symbols Outlined

---

## ✨ Features (v0.2 - Current State)

- **Comprehensive Dashboard:** Reach, Engagement, Ad Spend, and Follower Growth metrics.
- **Global Date Range Filter:** 7D / 30D / 90D / 6M / 1Y toggles that dynamically update all charts and UI components.
- **Responsive Design:** Fully responsive sidebar with mobile hamburger menu and slide-in drawer.
- **Dark Mode:** System and manual toggle support persisted to `localStorage`.
- **Export Capabilities:** CSV exporting for post analytics.
- **Platform Registry:** Full CRUD scaffolding for adding new social platforms to track.

> **Note to team:** The UI is currently built and populated with high-quality mock data (`src/lib/demo-data.ts`). The immediate next step is to hook up the frontend components to our Prisma Database.

---

## 🚀 Getting Started

Follow these instructions to get the project running locally for development.

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/pulse-analytics.git
cd pulse-analytics

# Install dependencies
npm install
```

### 2. Environment Variables
Copy the example environment file and fill in the necessary values:
```bash
cp .env.example .env
```
Key required variables:
- `DATABASE_URL`: Setup default to `file:./dev.db`
- `NEXTAUTH_SECRET`: Secret for NextAuth
- `ENCRYPTION_KEY`: A 32-character string for AES-256 data encryption (e.g., storing API keys/tokens).

### 3. Database Setup (Prisma)
Initialize the SQLite database and seed it with demo data:
```bash
# Push the schema to the database (creates tables)
npx prisma db push

# Seed the database
npx prisma db seed
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The app includes a dev-environment bypass in the middleware so you can view all authenticated routes locally without needing Google OAuth configured.

---

## 📂 Project Structure

```
pulse-analytics/
├── prisma/
│   ├── schema.prisma          # Database schema (Models: User, Workspace, Platform, Post, etc.)
│   └── seed.ts                # Database seeder
├── src/
│   ├── app/
│   │   ├── (dashboard)/       # Authenticated layout group (Dashboard, Posts, Paid, Insights)
│   │   ├── api/               # API Routes (auth, platforms CRUD)
│   │   └── login/             # Public login page
│   ├── components/
│   │   ├── charts/            # Recharts components (barrel exports)
│   │   ├── layout/            # Sidebar, TopHeader (barrel exports)
│   │   ├── skeletons/         # Page loading skeletons (barrel exports)
│   │   ├── ui/                # Reusable UI components (barrel exports)
│   │   ├── platforms/         # AddPlatformModal (barrel exports)
│   │   ├── providers/         # Session + Query providers (barrel exports)
│   │   └── index.ts           # Main components barrel export
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # Prisma singleton
│   │   ├── encryption.ts      # AES-256 utilities
│   │   ├── types/             # Shared TypeScript types (barrel exports)
│   │   ├── stores/            # Zustand stores
│   │   ├── index.ts           # Lib barrel export
│   │   └── demo-data.ts       # Mock data (deprecated)
│   └── middleware.ts          # Route protection and auth middleware
└── package.json
```

---

## 🗺 Roadmap & Next Steps

If you are picking up work on this repository, here are the immediate priorities:

1. **Frontend-to-DB Hookup (Phase 2.5):** Replace `demo-data.ts` arrays inside pages (`dashboard/page.tsx`, `posts/page.tsx`, etc.) with real React Server Component fetches using Prisma.
2. **Platform Management:** Connect the "Add Platform" modal (`src/components/platforms/AddPlatformModal.tsx`) logic to save OAuth tokens to the database.
3. **Authentication:** Remove the development bypass in `src/middleware.ts` and set up Google OAuth credentials so login is securely enforced.
4. **Real Data Pipeline (Phase 3):** Implement background chron jobs and API calls to Instagram/YouTube/TikTok to pull real metrics down and store them in the DB.

---

## 🤝 Contributing

- **Strict TypeScript:** Run `npm run type-check` (or `npx tsc --noEmit`) before opening a PR. The project currently has zero TS errors.
- **Tailwind v4:** Note the project uses Tailwind v4 styling paradigms (`globals.css` with `@theme` configurations).
- **Component Architecture:** Build small, reusable components. Keep server fetches separate from client interactivity where possible using the Next.js App Router paradigms.
