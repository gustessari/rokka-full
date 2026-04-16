# Rokka – Agent Instructions

## Cursor Cloud specific instructions

### Services

| Service | How to run |
|---|---|
| **MongoDB** | `mongod --dbpath /tmp/mongodb-data --port 27017 --fork --logpath /tmp/mongod.log` (must be running before the API starts) |
| **Rokka API (dev)** | `npm run dev` — runs `tsx watch src/index.ts` on port 3001 with hot reload |

### Environment

A `.env` file is required at the project root (not committed). Minimum contents:

```
MONGO_URI=mongodb://localhost:27017/rokka
JWT_SECRET=dev-secret-key-for-local-testing
PORT=3001
```

### Gotchas

- **MongoDB must start before the API.** The Express server calls `mongoose.connect()` at startup and will crash if MongoDB is unreachable.
- **MongoDB data directory:** Use `/tmp/mongodb-data` (writable) rather than the default `/var/lib/mongodb` which may have permission issues in this environment. Create it with `mkdir -p /tmp/mongodb-data` if it doesn't exist.
- **`npm run build` (tsc) has pre-existing type errors** in `src/controllers/vaultController.ts` (`req.user` is not typed on Express `Request`). The dev server (`tsx watch`) works fine since it transpiles without strict type-checking.
- **No test framework is configured.** There are no automated tests. Validate via API calls (curl).
- **No linter is configured.** There is no ESLint or similar tool in the project.

### API routes (for manual testing)

- `POST /api/auth/register` — body: `{ "email": "...", "password": "..." }`
- `POST /api/auth/login` — body: `{ "email": "...", "password": "..." }` → returns `{ "token": "..." }`
- `POST /api/vault/save` — body: `{ "type": "...", "encryptedData": "..." }` (requires `Authorization: Bearer <token>`)
- `GET /api/vault/all` — (requires `Authorization: Bearer <token>`)
