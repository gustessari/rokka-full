# Rokka – Agent Instructions

## Cursor Cloud specific instructions

### Services

| Service | How to run |
|---|---|
| **MongoDB** | `mkdir -p /tmp/mongodb-data && mongod --dbpath /tmp/mongodb-data --port 27017 --fork --logpath /tmp/mongod.log` (must be running before the API starts) |
| **Rokka API (backend)** | `npm run dev` — runs `tsx watch src/index.ts` on port 3001 with hot reload |
| **Frontend (Vite)** | `cd client && npx vite --host 0.0.0.0` — runs on port 5173, proxies `/api` to backend |

### Environment

A `.env` file is required at the project root (not committed). Minimum contents:

```
MONGO_URI=mongodb://localhost:27017/rokka
JWT_SECRET=dev-secret-key-for-local-testing
PORT=3001
```

### Gotchas

- **MongoDB must start before the API.** The Express server calls `mongoose.connect()` at startup and will crash if MongoDB is unreachable.
- **MongoDB data directory:** Use `/tmp/mongodb-data` (writable) rather than the default `/var/lib/mongodb` which may have permission issues in this environment.
- **Frontend uses Vite 8 with Rolldown.** Type-only imports must use `import type { ... }` syntax or the production build will fail with MISSING_EXPORT errors.
- **Frontend proxy:** The Vite dev server proxies `/api` requests to `http://localhost:3001`. Both servers must be running for the app to work.
- **Client-side encryption:** The vault key is stored only in `sessionStorage` and is never sent to the server. All encryption/decryption happens in the browser using AES (crypto-js).
- **No automated test framework.** Validate via the UI or API calls (curl).

### API routes (for manual testing)

- `POST /api/auth/register` — `{ "email": "...", "password": "..." }`
- `POST /api/auth/login` — `{ "email": "...", "password": "..." }` → `{ "token": "...", "user": {...} }`
- `GET /api/auth/me` — (auth required) current user info
- `POST /api/sections` — `{ "name": "...", "icon": "..." }` (auth required)
- `GET /api/sections` — list sections (auth required)
- `PUT /api/sections/:id` — update section (auth required)
- `DELETE /api/sections/:id` — delete section and its items (auth required)
- `POST /api/vault/save` — `{ "sectionId": "...", "type": "...", "encryptedData": "..." }` (auth required)
- `GET /api/vault/all?sectionId=...` — list items (auth required)
- `PUT /api/vault/:id` — update item (auth required)
- `DELETE /api/vault/:id` — delete item (auth required)
- `POST /api/vault/bulk-update` — `{ "items": [...] }` (auth required, used during lock)
