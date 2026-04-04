# Pulse Analytics — Implementation Plan

> **Project:** Social Media Analytics SaaS Dashboard  
> **Version:** 0.3 (Dashboard UI Refinements)  
> **Last Updated:** 2026-04-05

---

## 1. Project Overview

### 1.1 Architecture
- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 with Material Design 3 tokens
- **Database:** Prisma ORM with PostgreSQL (Neon) ✅
- **Auth:** NextAuth v5 with Google OAuth
- **State:** Zustand for global state
- **Charts:** Recharts for data visualization

### 1.2 Database Schema (10 Models)
```
User → Account, Session
Workspace → WorkspaceUser, SocialPlatform, ConnectedAccount, Post, PlatformDailySummary, AIInsightReport
```

---

## 2. Completed Implementation

### 2.1 UI Pages (Phase 1-2 Foundation)

| Page | Path | Status | Data Source |
|------|------|--------|-------------|
| Login | `/login` | ✅ Complete | NextAuth |
| Dashboard | `/dashboard` | ✅ Real Data | Prisma + Server Component |
| Posts | `/posts` | ✅ Real Data | `/api/posts` + Client fetch |
| Paid/Boosted | `/paid` | ✅ Real Data | Prisma + Server Component |
| Insights | `/insights` | ✅ Real Data | AIInsightReport + Posts |
| Monthly Report | `/report` | ✅ Real Data | Prisma + Server Component |
| Settings Hub | `/settings` | ✅ Complete | - |
| General Settings | `/settings/general` | ✅ Complete | - |
| Connected Accounts | `/settings/accounts` | ✅ Complete | ConnectedAccount API |
| Platform Registry | `/settings/platforms` | ✅ Complete | `/api/platforms` |
| Team Management | `/settings/team` | ✅ Complete | - |

### 2.2 API Routes Implemented

| Route | Methods | Description | Auth |
|-------|---------|-------------|------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth session handling | Public |
| `/api/platforms` | GET, POST | Platform CRUD | Required |
| `/api/platforms/[id]` | GET, PATCH, DELETE | Single platform ops | Required |
| `/api/connected-accounts` | GET, POST | List/create connections | Required |
| `/api/connected-accounts/[id]` | PATCH, DELETE | Update/disconnect | Required |
| `/api/dashboard/summary` | GET | KPI + platform mix | Required |
| `/api/dashboard/chart-data` | GET | Time-series data | Required |
| `/api/posts` | GET | Posts with filtering | Required |

### 2.3 Server Components (Real Data)

```
dashboard/page.tsx     → DashboardClient.tsx
paid/page.tsx          → PaidClient.tsx
insights/page.tsx      → InsightsClient.tsx
report/page.tsx        → ReportClient.tsx
```

**Pattern:** Server Component fetches with Prisma → Passes props to Client Component → Client handles interactivity

### 2.4 Client Components (Interactive UI)

- `DashboardClient.tsx` — KPI cards, charts, platform mix
- `PaidClient.tsx` — Spend KPIs, charts, boosted posts
- `InsightsClient.tsx` — AI cards, ROI table
- `ReportClient.tsx` — Monthly report, top posts, content plan

### 2.5 Key Features Implemented

| Feature | Implementation Details |
|---------|------------------------|
| Date Range Filter | Zustand store `useDateRange` — 7D/30D/90D/6M/1Y |
| Dark Mode | Zustand `useTheme` + M3 tokens in globals.css |
| Mobile Sidebar | Drawer with backdrop, hamburger menu |
| CSV Export | Client-side CSV generation from filtered posts |
| Responsive Charts | Recharts with ResponsiveContainer |
| Encrypted Tokens | AES-256-GCM for OAuth tokens in DB |
| Currency | INR (₹) | `formatCurrency()` helper uses Indian Rupees |
| Ad Account Filtering | Ad platforms excluded from Platform Mix and Platform Performance Breakdown |
| Platform Mix Reach Values | Legend shows actual reach numbers (K/M) instead of percentages |
| Monthly Ad Spend Grouping | Ad Spend chart groups by month for 30d+ date ranges |
| Follower Growth Tooltip | Hover tooltip shows platform name alongside follower count |
| TypeScript Strict | Zero `any` types, full type coverage |

---

## 3. Data Flow Architecture

### 3.1 Dashboard Data Flow
```
User selects date range
        ↓
DashboardClient (Client Component)
        ↓
dashboard/page.tsx (Server Component)
        ↓
Prisma → PlatformDailySummary + Post tables
        ↓
DashboardClient receives: { kpis, platformMix, totals, summaries }
        ↓
Render KPI cards, charts, platform breakdown
```

### 3.2 Posts Data Flow
```
User searches/filters on Posts page
        ↓
posts/page.tsx (Client Component)
        ↓
Fetch /api/posts?search=&platform=&sort=
        ↓
API route queries Prisma Post table
        ↓
Return paginated, filtered results
        ↓
Update table with loading states
```

### 3.3 Connected Accounts Flow
```
User clicks "Connect Platform"
        ↓
OAuth flow (Google/Instagram/etc)
        ↓
Callback handler receives tokens
        ↓
Encrypt tokens with AES-256-GCM
        ↓
POST /api/connected-accounts
        ↓
Store in ConnectedAccount table
        ↓
Display in settings/accounts list
```

---

## 4. Database Queries (Key Examples)

### 4.1 Dashboard KPI Aggregation
```typescript
// Aggregate from PlatformDailySummary
const summaries = await prisma.platformDailySummary.findMany({
  where: { workspaceId, date: { gte: startDate, lte: endDate } }
});

const totals = summaries.reduce((acc, summary) => ({
  orgReach: acc.orgReach + (summary.orgReach || 0),
  paidReach: acc.paidReach + (summary.paidReach || 0),
  impressions: acc.impressions + (summary.impressions || 0),
  adSpend: acc.adSpend + (summary.adSpend || 0),
  followers: Math.max(acc.followers, summary.followers || 0),
}), { orgReach: 0, paidReach: 0, impressions: 0, adSpend: 0, followers: 0 });
```

### 4.2 Posts with Filtering
```typescript
const posts = await prisma.post.findMany({
  where: {
    workspaceId,
    OR: [
      { caption: { contains: search, mode: 'insensitive' } },
      { platformSlug: { contains: search, mode: 'insensitive' } }
    ],
    platformSlug: platformFilter !== 'all' ? platformFilter : undefined,
  },
  orderBy: { [sortField]: sortOrder },
  skip: (page - 1) * pageSize,
  take: pageSize,
});
```

### 4.3 Platform Grouping for Mix Chart
```typescript
const groupedSummaries = await prisma.platformDailySummary.groupBy({
  by: ['platformSlug'],
  where: { workspaceId, date: { gte: startDate, lte: endDate } },
  _sum: { orgReach: true, paidReach: true },
});
```

---

## 5. Security Implementation

| Layer | Implementation |
|-------|---------------|
| Auth | NextAuth v5 with Google OAuth provider |
| Route Protection | `middleware.ts` checks for valid session |
| API Auth | `auth()` helper in each route handler |
| Token Storage | AES-256-GCM encryption in `encryption.ts` |
| CSRF | NextAuth built-in CSRF protection |
| XSS | React's built-in escaping + careful dangerouslySetInnerHTML avoidance |

---

## 6. Performance Optimizations

| Optimization | Implementation |
|-------------|------------------|
| Server Components | Data fetching on server reduces client JS |
| Parallel Queries | `Promise.all()` for independent Prisma queries |
| Debounced Search | 300ms debounce on posts search input |
| Pagination | Cursor-based pagination for large datasets |
| Chart Responsiveness | `ResponsiveContainer` from Recharts |
| Image Optimization | Next.js Image component where applicable |

---

## 7. Remaining Work (Phase 3+)

### 7.1 Real Data Pipeline (Priority 1)
- [ ] Generic OAuth sync engine
- [ ] Instagram Graph API integration
- [ ] Facebook Pages API integration
- [ ] YouTube Data API integration
- [ ] TikTok API integration
- [ ] LinkedIn Marketing API integration
- [ ] Webhook receivers
- [ ] Background cron jobs for sync

### 7.2 AI Insights Engine (Priority 2)
- [ ] Gemini/GPT API integration
- [ ] Auto-generate monthly AI reports
- [ ] Wasted spend detection algorithm
- [ ] Boost candidate scoring
- [ ] Budget reallocation ML

### 7.3 Reports & Export (Priority 3)
- [ ] PDF generation (Puppeteer/react-pdf)
- [ ] White-label branding per workspace
- [ ] Shareable public report links

### 7.4 Production Hardening (Priority 4)
- [x] PostgreSQL migration (Neon)
- [ ] RBAC enforcement
- [ ] Multi-workspace switching
- [ ] Rate limiting
- [ ] E2E tests (Playwright)

---

## 8. File Structure Summary

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Server Component (fetches data)
│   │   │   └── DashboardClient.tsx  # Client Component (UI)
│   │   ├── posts/
│   │   │   └── page.tsx          # Client Component (fetch + state)
│   │   ├── paid/
│   │   │   ├── page.tsx          # Server Component
│   │   │   └── PaidClient.tsx    # Client Component
│   │   ├── insights/
│   │   │   ├── page.tsx          # Server Component
│   │   │   └── InsightsClient.tsx
│   │   ├── report/
│   │   │   ├── page.tsx          # Server Component
│   │   │   └── ReportClient.tsx  # Client Component
│   │   └── settings/
│   ├── api/
│   │   ├── connected-accounts/
│   │   │   ├── route.ts          # GET, POST
│   │   │   └── [id]/
│   │   │       └── route.ts      # PATCH, DELETE
│   │   ├── dashboard/
│   │   │   ├── summary/
│   │   │   │   └── route.ts      # Dashboard KPIs
│   │   │   └── chart-data/
│   │   │       └── route.ts      # Time-series data
│   │   ├── platforms/
│   │   │   └── route.ts          # Platform CRUD
│   │   └── posts/
│   │       └── route.ts          # Posts API
│   └── login/
│       └── page.tsx
├── components/
│   ├── charts/                   # Recharts components (barrel exports)
│   ├── layout/                   # Sidebar, TopHeader (barrel exports)
│   ├── skeletons/                # Page loading skeletons (barrel exports)
│   ├── ui/                       # Reusable UI (barrel exports)
│   ├── platforms/                # Platform icons (barrel exports)
│   ├── pdf/                      # PDF components (barrel exports)
│   ├── providers/                # Context providers (barrel exports)
│   └── index.ts                  # Main components barrel export
├── lib/
│   ├── auth.ts                   # NextAuth config
│   ├── prisma.ts                 # Prisma singleton
│   ├── encryption.ts             # AES-256 utilities
│   ├── types/                    # Shared TypeScript types (barrel exports)
│   ├── stores/                   # Zustand stores
│   ├── index.ts                  # Lib barrel export
│   └── demo-data.ts              # Mock data (deprecated)
└── middleware.ts                 # Auth protection
```

---

## 9. Environment Variables

```bash
# Required
DATABASE_URL="postgresql://user:password@host/dbname"  # Neon PostgreSQL
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (for production)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Encryption
ENCRYPTION_KEY="32-character-key-for-aes-256"
```

---

## 10. Commands Reference

```bash
# Development
npm run dev              # Start dev server

# Database
npx prisma db push       # Apply schema changes
npx prisma db seed       # Seed demo data
npx prisma studio        # Open DB GUI
npx prisma generate      # Regenerate client

# Build
npm run build            # Production build
npx tsc --noEmit         # Type check only

# Lint
npm run lint             # ESLint check
```
