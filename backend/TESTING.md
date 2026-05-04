# MediMentor — Backend Testing Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Running Tests](#running-tests)
4. [Test Architecture](#test-architecture)
5. [Test Levels Explained](#test-levels-explained)
6. [What Each Test Covers](#what-each-test-covers)
7. [Common Failures & Fixes](#common-failures--fixes)
8. [Adding New Tests](#adding-new-tests)

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- Internet connection (first run only — downloads ~780MB MongoDB binary)
- No need for a real MongoDB instance — tests use an in-memory database

---

## Setup

```bash
cd backend
npm install
```

That's it. No `.env` changes needed for tests — secrets are injected directly in each test file.

---

## Running Tests

### Run all tests
```bash
npm test
```

### Run only unit tests (fast, no MongoDB download needed)
```bash
npm run test:unit
```

### Run only integration tests
```bash
npm run test:integration
```

### Run only E2E tests
```bash
npm run test:e2e
```

### ⚠️ First Run Warning
On the very first run, `mongodb-memory-server` will download a MongoDB binary (~780MB).
This can take **5–15 minutes** depending on your internet speed.
After the first download it is cached permanently — all subsequent runs are fast (< 5 seconds).

If the download times out, just run `npm test` again. It will resume from where it left off.

---

## Test Architecture

```
backend/
└── tests/
    ├── setup.js                          # Shared in-memory MongoDB helpers
    ├── app.js                            # Testable Express app (no server.listen)
    ├── unit/
    │   └── auth.unit.test.js             # Pure logic tests (no DB, no HTTP)
    ├── integration/
    │   ├── auth.integration.test.js      # Auth routes + DB
    │   ├── appointment.integration.test.js  # Appointment routes + DB
    │   └── doctor.integration.test.js    # Doctor/monitor routes + DB
    └── e2e/
        └── booking.e2e.test.js           # Full user journey
```

### Key files

**`tests/setup.js`** — Provides three helpers used by every integration/e2e test:
- `connectTestDB()` — starts an in-memory MongoDB and connects Mongoose
- `clearTestDB()` — wipes all collections between tests
- `closeTestDB()` — stops the in-memory server after all tests

**`tests/app.js`** — A clean Express app with all routes mounted but without `httpServer.listen()`. This lets Supertest make HTTP requests without binding a real port.

---

## Test Levels Explained

### Unit Tests (`tests/unit/`)
- Test pure JavaScript logic in isolation
- No database, no HTTP requests
- Run instantly (< 2 seconds)
- Cover: JWT creation/verification, bcrypt hashing, metrics recording, input validation regex

### Integration Tests (`tests/integration/`)
- Test HTTP routes end-to-end against a real (in-memory) database
- Use Supertest to make actual HTTP requests to the Express app
- Each `describe` block gets a fresh database
- Cover: registration, login, token refresh, logout, appointment CRUD, doctor search, admin stats

### E2E Tests (`tests/e2e/`)
- Simulate a complete real-world user journey in sequence
- Steps depend on each other (login uses the user created in the previous step)
- Cover: register → login → book appointment → verify password → refresh token → logout

---

## What Each Test Covers

### Unit: `auth.unit.test.js`

| Test | What it checks |
|------|---------------|
| Creates valid access token | JWT payload contains `_id` and `role` |
| Rejects tampered token | Modified token throws verification error |
| Rejects expired token | Token with 1ms expiry fails after delay |
| Hashes and verifies password | bcrypt hash + compare works correctly |
| Rejects wrong password | bcrypt compare returns false for wrong input |
| Records requests | Metrics counter increments on `recordRequest()` |
| Records errors | Error appears in `recentErrors` array |
| Tracks slow requests | Requests >1000ms appear in `slowRequests` |
| Calculates response time stats | avg, p95, p99 are computed correctly |
| Validates email format | Regex accepts valid, rejects invalid |
| Validates phone format | 10-digit passes, short fails |

---

### Integration: `auth.integration.test.js`

| Test | What it checks |
|------|---------------|
| Register user | Returns 201, user saved to DB |
| Reject duplicate email | Returns 400 on second registration |
| Reject missing fields | Returns 400 when required fields absent |
| Reject invalid email | Returns 400 for malformed email |
| Reject invalid phone | Returns 400 for non-10-digit phone |
| Register doctor | Returns 201 with doctor `_id` |
| Reject duplicate MCI number | Returns 400 |
| Login with valid credentials | Returns `accessToken` + sets `refreshToken` cookie |
| Reject wrong password | Returns 401 |
| Reject non-existent user | Returns 401 |
| Reject invalid role | Returns 400 |
| Refresh token | Returns new `accessToken` using cookie |
| Reject refresh with no cookie | Returns 401 |
| Logout | Clears `refreshToken` cookie |
| Block request with no token | Returns 401 |
| Block request with invalid token | Returns 401 |
| Allow request with valid token | Returns 200 or 404 (auth passed) |

---

### Integration: `appointment.integration.test.js`

| Test | What it checks |
|------|---------------|
| Create appointment | Returns 201 with generated `appointmentID` |
| Reject without auth | Returns 401 |
| Reject non-existent doctor | Returns 404 |
| Get current appointments (empty) | Returns 404 when none exist |
| Get current appointments (with data) | Returns 200 with appointment list |
| Get appointment stats | Returns totals for all states |
| Get doctor appointments | Returns `pendingAppointments` and `approvedAppointments` arrays |

---

### Integration: `doctor.integration.test.js`

| Test | What it checks |
|------|---------------|
| List doctors | Returns paginated list with `totalDoctors` |
| Search by name | Returns matching doctors |
| Search unknown query | Returns empty array |
| Get total doctors (admin) | Returns count, requires admin token |
| Block non-admin from totals | Returns 401 without token |
| Health check | Returns `{ status: "ok" }` publicly |
| Get monitor stats (admin) | Returns full metrics object |
| Block non-admin from stats | Returns 401 |

---

### E2E: `booking.e2e.test.js`

Steps run in order — each depends on the previous:

| Step | Action | Expected |
|------|--------|----------|
| 1 | Patient registers | 201 |
| 2 | Doctor registers | 201, returns `_id` |
| 3 | Patient logs in | 200, `accessToken` + `refreshToken` cookie |
| 4 | Doctor logs in | 200, `accessToken` |
| 5 | Patient books appointment | 201, state = `pending`, has `appointmentID` |
| 6 | Patient views appointments | 200, shows pending appointment |
| 7 | Doctor views appointments | 200, shows in `pendingAppointments` |
| 8 | Wrong meeting password | 404 (no contract exists yet) |
| 9 | Token refresh mid-session | 200, new token different from original |
| 10 | Logout | 200, cookie cleared |
| 11 | Stats reflect appointment | `totalAppointments > 0`, `pendingAppointments > 0` |

---

## Common Failures & Fixes

### ❌ `Exceeded timeout of 30000ms` on first run
**Cause:** MongoDB binary is downloading for the first time.  
**Fix:** Run `npm test` again. The download continues from cache. Or wait — it will complete eventually.

### ❌ `MongooseError: Operation buffering timed out`
**Cause:** MongoDB binary download failed or is corrupted.  
**Fix:**
```bash
# Clear the binary cache
rm -rf ~/.cache/mongodb-binaries
# On Windows:
Remove-Item "$env:USERPROFILE\.cache\mongodb-binaries" -Recurse -Force
# Then run tests again
npm test
```

### ❌ `Cannot find module '../../../socket'`
**Cause:** Frontend socket import path issue (not related to backend tests).  
**Fix:** This only affects frontend — backend tests are unaffected.

### ❌ `JWT_SECRET is not defined`
**Cause:** Test file missing the env setup at the top.  
**Fix:** Every test file must have these lines at the top:
```js
process.env.JWT_SECRET = "test_secret";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret";
process.env.NODE_ENV = "test";
```

### ❌ `MongoServerError: E11000 duplicate key`
**Cause:** `clearTestDB()` not called between tests, or `beforeAll` called `connectTestDB()` when already connected.  
**Fix:** Ensure each test file has:
```js
afterEach(async () => { await clearTestDB(); });
```

### ❌ Integration tests pass but E2E fails at Step 5+
**Cause:** `doctorId` from Step 2 is `undefined` because Step 2 failed silently.  
**Fix:** Check that doctor registration returns `res.body.doctor._id`. If the doctor schema validation fails (e.g. missing `certificate`), Step 2 returns 400 and `doctorId` stays undefined.

### ❌ `Option "testPathPattern" was replaced`
**Cause:** Jest 30 renamed the flag.  
**Fix:** Already fixed in `package.json`. Use `--testPathPatterns` (plural).

---

## Adding New Tests

### Adding a unit test
```js
// tests/unit/myfeature.unit.test.js
import { describe, it, expect } from "@jest/globals";

describe("Unit: My Feature", () => {
  it("does something correctly", () => {
    expect(1 + 1).toBe(2);
  });
});
```

### Adding an integration test
```js
// tests/integration/myroute.integration.test.js
import { describe, it, expect, beforeAll, afterAll, afterEach } from "@jest/globals";
import request from "supertest";
import app from "../app.js";
import { connectTestDB, clearTestDB, closeTestDB } from "../setup.js";

process.env.JWT_SECRET = "test_secret";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret";
process.env.NODE_ENV = "test";

beforeAll(async () => { await connectTestDB(); });
afterEach(async () => { await clearTestDB(); });
afterAll(async () => { await closeTestDB(); });

describe("Integration: GET /my-route", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/my-route");
    expect(res.status).toBe(200);
  });
});
```

### Rules for writing tests
1. Always set `process.env.JWT_SECRET` at the top of every test file
2. Always call `connectTestDB()` in `beforeAll` and `closeTestDB()` in `afterAll`
3. Use `clearTestDB()` in `afterEach` to prevent data leaking between tests
4. Never import from `../server.js` — always use `../app.js` (no `listen()`)
5. Use `bcrypt.hash()` directly when seeding test users — don't rely on the pre-save hook for speed

---

## Test Environment vs Production

| Thing | Tests | Production |
|-------|-------|-----------|
| Database | In-memory (MongoMemoryServer) | MongoDB Atlas |
| JWT Secret | `"test_secret"` | From `.env` |
| Email sending | Not tested (mocked by not calling) | Nodemailer via Gmail |
| Image compression | Skipped (base64 `"dGVzdA=="`) | Sharp |
| Socket.io | Not tested in unit/integration | Real WebSocket |
| Redis cache | Not used | Upstash (when configured) |
