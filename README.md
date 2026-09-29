# Flowpilot

A Next.js application for a two-sided technology recruitment and job marketplace.

## What Flowpilot includes

- Public job discovery, marketplace stories, community, and support pages.
- Job Seeker registration, profiles, job applications, and application tracking.
- Employer registration, company profiles, job posting, applicant review, and talent browsing.
- A separate admin sign-in and marketplace oversight area.
- Optional Google sign-in and an optional AI-assisted support chat.

## Scripts

- `npm run dev` starts the Next.js development server.
- `npm run build` creates a production build.
- `npm run start` runs the production server after a build.
- `npm run lint` checks the codebase with ESLint.
- `npm test` runs the Vitest test suite.
- `npm run test:coverage` runs the test suite with coverage reporting.

## Project Structure

- `app/` contains Next.js App Router pages and API routes.
- `components/` contains shared marketplace UI.
- `lib/` contains server-side data, session, and domain helpers.
- `data/` contains local JSON seed data.
- `public/` contains static images and icons.

## Environment

Copy `.env.example` to `.env.local` and supply the required local values. Do not commit `.env.local`.

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Required values:

- `DATABASE_URL`: PostgreSQL connection string.
- `AUTH_SECRET`: a long, random secret used for authentication.
- `AUTH_URL`: the base URL of the running application.
- `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`: credentials for the dedicated admin account.

Google sign-in is optional. Set either `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`, or `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, and register the callback URL shown in `.env.example`.

### Support chat

Set `GEMINI_API_KEY` in `.env.local` to enable AI-assisted replies on the support page. The server uses its built-in, finite free-tier model sequence and automatically moves to the next option once for quota, rate-limit, timeout, or temporary-availability failures. It never exposes provider errors or credentials to visitors.

If no model can answer, support still returns a local, Flowpilot-specific reply based on the visitor's latest message. Chat history, authentication, and the client response format remain unchanged.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```
