# SDE I/II - Take Home Assignment

Context

I built a small web application to let NGOs submit monthly reports (individually or in bulk) and to let an admin view aggregated dashboard data. The system is designed to handle background processing, partial failures, and higher input volumes.

What I built

- Frontend: React + Vite app with pages for single report submission, bulk CSV upload (returns a job ID and shows progress), and an admin dashboard for monthly aggregates.
- Backend: Node.js + Express API with asynchronous CSV processing using BullMQ + Redis and MongoDB for persistence.

Tech stack (this repo)

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB (Mongoose), BullMQ (Redis), JWT for auth

Quick setup

1. Backend

```bash
cd backend
cp .env.example .env   # set MONGO_URI, REDIS_URL, JWT_SECRET
npm install
npm run dev
```

2. Frontend

```bash
cd frontend
cp .env.example .env   # set VITE_API_URL if needed
npm install
npm run dev
```

Key API endpoints

- `POST /auth/login` — authenticate admin
- `POST /report` — submit a single report
- `POST /reports/upload` — upload CSV (multipart/form-data), returns `{ jobId }`
- `GET /job-status/:jobId` — poll for job progress/status
- `GET /dashboard?month=YYYY-MM` — aggregated dashboard (admin only)

Admin account note

There is no public admin signup UI included (to avoid open admin registration). To create an admin locally run:

```bash
node src/new.js
```

This creates a test admin account. Use these credentials to log in:

- **Email:** **test@example.com**
- **Password:** **123456**

Why no public signup

I avoided a public admin signup to prevent unauthorized admin creation in demos or public deployments; admin accounts should be provisioned by maintainers.

Implementation notes

- CSV uploads are processed in the background by a worker process (BullMQ + Redis). The frontend polls `GET /job-status/:jobId` to show progress and errors.
- Idempotency is enforced by upserting reports on the `{ ngoId, month }` index so the same NGO/month is not double-counted.

What to include in submission

- GitHub repo (or ZIP)
- Short writeup describing architecture decisions and any bonus features implemented
- (Optional) Deployed demo link or short recording

