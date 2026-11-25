# Tender Platform

Full-stack tender and bidding platform built as a diploma project at KPI (FIOT, 2026).
Companies publish tenders, users submit bids, admins manage the system.

## Features

- Registration and login with JWT authentication; passwords hashed with bcrypt
- Three roles: user, company, admin, with role-based routing on the client
- Tender list, tender details, creation and editing (companies)
- Bid submission and acceptance; a bid placed in the last hour extends the tender deadline by one hour (auction mode)
- "My tenders" and "My bids" pages, profile with activity statistics
- Admin panel for managing users and tenders
- Forms validated with React Hook Form + Zod

## Tech stack

**Client:** React 19, TypeScript, Vite, React Router, React Hook Form, Zod, Tailwind CSS
**Server:** Node.js, Express 5, MongoDB (Mongoose), JSON Web Tokens, bcryptjs

## Screenshots

<!-- add 2-3 screenshots: tender list, tender detail, admin panel -->

## Getting started

Requirements: Node.js 20+, a MongoDB database (e.g. a free MongoDB Atlas cluster).

```bash
# server
cd server
cp .env.example .env      # fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev               # http://localhost:5001

# client (second terminal)
cd client
npm install
npm run dev               # http://localhost:5173
```

The client currently expects the API at `http://localhost:5001`.

## Known limitations

- Role checks on the server are incomplete: some routes are protected only on the client
- No server-side input validation (Zod is used in client forms only)
- No automated tests and no deployment yet

## Roadmap

- [ ] Server-side authorization (`requireRole`, ownership checks)
- [ ] Zod validation middleware on the API
- [ ] Move the API URL to environment variables on the client
- [ ] Tests and deployment
