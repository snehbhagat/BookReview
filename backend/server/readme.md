# Book Review API (Node + Express + MongoDB + Redis)

## Prerequisites
- Node 18+
- Docker (for MongoDB and Redis), or local MongoDB/Redis installs

## Quick start
```bash
# 1) Start MongoDB and Redis
docker compose up -d

# 2) Install deps
cd server
npm install

# 3) Env vars
cp .env.example .env
# edit .env as needed

# 4) Run
npm run dev
# API at http://localhost:4000
```

## Endpoints (MVP)
- `POST /api/auth/register` (name, email, password)
- `POST /api/auth/login` (email, password)
- `GET /api/books?search=&genre=&author=&sort=rating|newest&page=&limit=`
- `POST /api/books` (auth) — create new book
- `GET /api/books/:id`
- `GET /api/books/:id/reviews?page=&limit=`
- `POST /api/books/:id/reviews` (auth)

See `openapi.yaml` for the full contract.

## Notes
- Redis caches list and detail endpoints briefly (60s). Caches are invalidated on create/update via simple flush. We can make this more granular later.
- Review uniqueness per (user, book) is enforced with a compound unique index.
- JWT is expected in `Authorization: Bearer <token>` header.