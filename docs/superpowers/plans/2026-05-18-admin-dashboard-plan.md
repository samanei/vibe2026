# Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first admin page with fixed-code admin login, a real DB-backed dashboard API, and a minimal `/admin` dashboard UI.

**Architecture:** Add a focused Express admin route under `/api/admin/dashboard` and keep data shaping in a small backend helper that can be tested with Node's built-in test runner. Add standalone React admin pages outside the student `Layout` so the admin dark navigation does not affect student routes.

**Tech Stack:** Express.js, MariaDB via `mysql2`, React, TypeScript, Vite, Tailwind CSS, Node built-in test runner.

---

### Task 1: Backend Dashboard Data Helpers

**Files:**
- Create: `backend/lib/adminDashboard.js`
- Create: `backend/tests/adminDashboard.test.js`
- Modify: `backend/package.json`

- [ ] Write failing tests for agreement-rate calculation, fixed zero-value chart labels, and row normalization.
- [ ] Run `npm test` in `backend` and verify the tests fail because the helper module does not exist.
- [ ] Implement the helper functions and constants.
- [ ] Run `npm test` in `backend` and verify the tests pass.

### Task 2: Backend Admin Route

**Files:**
- Create: `backend/routes/admin.js`
- Modify: `backend/index.js`

- [ ] Add `GET /api/admin/dashboard` with KPI, pending inquiry, popular agenda, and chart queries.
- [ ] Register the route under `/api/admin`.
- [ ] Run `node --check index.js` and `node --check routes/admin.js` in `backend`.

### Task 3: Frontend Admin Auth and Pages

**Files:**
- Create: `frontend/src/lib/adminAuth.ts`
- Create: `frontend/src/components/admin/AdminGNB.tsx`
- Create: `frontend/src/pages/AdminLoginPage.tsx`
- Create: `frontend/src/pages/AdminDashboardPage.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/types/index.ts`
- Modify: `frontend/src/constants/index.ts`

- [ ] Add fixed-code admin login helpers.
- [ ] Add admin login and dashboard pages.
- [ ] Add protected `/admin` routing.
- [ ] Render the dashboard from `GET /api/admin/dashboard`.
- [ ] Keep `/admin/agendas` and `/admin/inquiries` as future links only.

### Task 4: Verification and Commit

**Files:**
- All changed files.

- [ ] Run `npm test` in `backend`.
- [ ] Run `npm run build` in `frontend`.
- [ ] If feasible, run the backend and frontend dev servers and verify `/admin/login` to `/admin`.
- [ ] Commit the logical completed change.

## Self-Review

- The plan covers fixed-code admin login, the protected `/admin` route, DB-backed dashboard data, and the first admin page only.
- It intentionally excludes `/admin/agendas` and `/admin/inquiries` pages.
- It avoids new runtime dependencies and uses Node's built-in test runner for backend helper behavior.
