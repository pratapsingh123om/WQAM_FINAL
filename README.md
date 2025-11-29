I tried to open the GitHub link you gave but couldn’t fetch it from my environment — so I wrote this README from the code, errors and file listings you pasted in the chat (your `FRONTEND/frontend` and `BACKEND/backend` contents, docker logs, and the endpoints we discussed). If you want the README tailored to the *exact* repo contents, paste the repo or allow public access and I’ll re-generate it. Meanwhile — here’s a complete, production-ready **README.md** you can drop into your repo root and adapt.

# WQAM — Water Quality Assessment & Monitoring Dashboard

> Full-stack WQAM project (Frontend: Vite/React, Backend: FastAPI + SQLAlchemy, Data: TimescaleDB/Postgres, Storage: MinIO, Cache: Redis, Observability: Grafana).
> This README documents architecture, setup, dev workflows, endpoints, common errors and next steps for ML/AI integration.

---

# Table of contents

1. Project overview
2. Architecture & components
3. Folder structure (as implemented)
4. Quick start (requirements + run locally with Docker Compose)
5. Incremental build / dev workflow (avoid rebuilding unchanged images)
6. Frontend config (where to set backend URL, `config.js`)
7. Backend overview (endpoints, DB models)
8. Admin / user / validator flows & default admin credentials
9. Admin approval flow (UI + backend)
10. Database access (psql / GUI)
11. Troubleshooting (common errors seen & fixes)
12. Next steps: DB models, ML service, AI baseline, production notes
13. Contact / contributors

---

# 1 — Project overview

WQAM is a dashboard & platform for water quality monitoring and validation with three user roles:

* **Admin** — approves user/validator registrations, views approval board, receives alerts.
* **User** — industries, WTP/STP operators, municipal accounts; uploads CSV/PDF (OCR), sees dashboards & receives alerts.
* **Validator** — government/private/AI-enabled validators who validate reports and mark them as approved.

Major features implemented / in-progress in the repo:

* Vite React frontend served behind nginx (containerized).
* FastAPI backend with JWT auth, SQLAlchemy models, `pbkdf2_sha256` password hashing.
* TimescaleDB (Postgres) for time-series storage.
* Redis and MinIO for caching and object storage.
* Grafana for monitoring.
* Signup/login flows + admin approval endpoints.
* Docker Compose stack to run all services locally.

---

# 2 — Architecture & components

```
Browser (React Vite)  <-->  nginx (frontend container)  (host:5173)
                             |
                             +--> Backend API (FastAPI, uvicorn) (host:4000)
Backend uses:
 - Postgres/TimescaleDB (5432)
 - Redis (6379)
 - MinIO (9000 / console 9001)
Observability:
 - Grafana (3000)
```

Services in `docker-compose.yml`:

* `frontend` (nginx + static build)
* `backend` (FastAPI, uvicorn)
* `timescaledb`
* `redis`
* `minio`
* `grafana`

---

# 3 — Folder structure (what your repo looks like)

(Adapted from your listings)

```
WQAM/
  FRONTEND/
    frontend/
      public/
      src/
        pages/
          admin/
            AdminLogin.jsx
            Dashboard.jsx
            AdminLogin.css? (watch file names)
          user/
            UserLogin.jsx
            UserRegister.jsx
            UserDashboard.jsx
          vaildator/ (note: spelling mismatch — see Troubleshooting)
            ValidatorLogin.jsx
            ValidatorRegister.jsx
            ValidatorDashboard.jsx
        App.jsx
        main.jsx
        config.js (create this)
      Dockerfile
      nginx.conf
      package.json
  BACKEND/
    backend/
      app/
        main.py
        models.py
        schemas.py
        database.py
      Dockerfile
      requirements.txt
  docker-compose.yml
  docker-compose.override.yml (optional)
```

**Important** — filenames and folder names + import paths must match exactly (case-sensitive in Docker/Linux). You had `vaildator` vs `validator` and other mismatches — that caused many build errors. Fix those names consistently.

---

# 4 — Quick start with Docker Compose (Windows PowerShell)

Prereqs:

* Docker Desktop for Windows (WSL2 recommended)
* Node and Python only needed for local dev if not containerized

Place `docker-compose.yml` at repo root (you already have one). Example `docker-compose.yml` (summary of what you already used):

```yaml
version: '3.8'
services:
  frontend:
    build:
      context: ./FRONTEND/frontend
      dockerfile: Dockerfile
    container_name: wqam-frontend
    ports:
      - "5173:80"
    depends_on:
      - backend
    restart: always

  backend:
    build:
      context: ./BACKEND/backend
      dockerfile: Dockerfile
    container_name: wqam-backend
    command: uvicorn app.main:app --host 0.0.0.0 --port 4000 --reload
    ports:
      - "4000:4000"
    environment:
      DB_HOST: timescaledb
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: postgres
      DB_NAME: wqam
    restart: always
    depends_on:
      - timescaledb
      - redis
      - minio

  timescaledb:
    image: timescale/timescaledb-ha:pg14-latest
    container_name: timescaledb
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: wqam
    ports:
      - "5432:5432"
    volumes:
      - tsdb_data:/home/postgres/pgdata/data
  redis:
    image: redis:7.2
    container_name: redis
    ports:
      - "6379:6379"
  minio:
    image: minio/minio
    container_name: minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minio
      MINIO_ROOT_PASSWORD: minio123
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
  grafana:
    image: grafana/grafana
    container_name: grafana
    ports:
      - "3000:3000"

volumes:
  tsdb_data:
  minio_data:
```

Start all services (first time — building images may take a while):

```powershell
# from repo root (WQAM/)
docker compose up -d --build
```

Check container status:

```powershell
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

Check logs:

```powershell
docker compose logs -f frontend
docker compose logs -f backend
```

Access:

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend API: [http://localhost:4000](http://localhost:4000) (health: `/health` — should return `{"status":"ok"}`)
* MinIO Console: [http://localhost:9001](http://localhost:9001)
* Grafana: [http://localhost:3000](http://localhost:3000)
* TimescaleDB (psql): localhost:5432 (user: postgres / password: postgres / database: wqam)

---

# 5 — Incremental builds (avoid rebuilding unchanged images)

Create `docker-compose.override.yml` in project root (next to `docker-compose.yml`). This file overrides or adds settings for development only. Example snippet that points frontend at a local pre-built image and tells compose not to rebuild unchanged images:

```yaml
services:
  frontend:
    build:
      context: ./FRONTEND/frontend
      dockerfile: Dockerfile
    # keep host -> container mapping
    ports:
      - "5173:80"
  backend:
    build:
      context: ./BACKEND/backend
      dockerfile: Dockerfile
```

**Commands to build only changed services**:

```powershell
# build only backend (faster)
docker compose build backend

# build only frontend
docker compose build frontend

# to rebuild frontend without touching other images
docker compose up -d --no-deps --build frontend
```

If you want to *keep* images and not rebuild them at all, just `docker compose up -d` — Compose will reuse existing images/containers.

Put `docker-compose.override.yml` in the repo root (same folder as `docker-compose.yml`). Docker Compose automatically loads it.

---

# 6 — Frontend: where to set backend URL (`src/config.js`)

Create `src/config.js` (or `src/config/index.js`) and export the API base URL for axios to use:

```js
// src/config.js
// Use Vite env variable or fallback to localhost for development
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
```

In components/pages where you call the API, use:

```js
import { API_BASE } from '../config';
const res = await fetch(`${API_BASE}/auth/login`, { ... });
```

**Note**: If the frontend is running in a container (nginx) and needs to call `localhost:4000`, that `localhost` refers to the container itself — not your host. For containerized frontend -> backend calls use `http://wqam-backend:4000` *inside* containers. To make this simple, keep frontend HTTP calls pointing at `http://localhost:4000` and when running the browser locally (host), it will reach backend on host port 4000. If you host both in Docker, set `VITE_API_BASE_URL=http://wqam-backend:4000` at build time.

For Vite, set env in `.env`:

```
VITE_API_BASE_URL=http://localhost:4000
```

Then rebuild frontend with `docker compose build frontend` so Vite in build picks up the env.

---

# 7 — Backend overview (endpoints & DB model summary)

**Main endpoints implemented (FastAPI):**

* `GET /health` — health check
* `POST /register?role=user` — user registration (payload `RegisterRequest`)
* `POST /register?role=validator` — validator registration
* `POST /auth/login` — login for user/validator (returns JWT access_token)
* `POST /auth/admin-login` — admin login (returns JWT)
* `GET /admin/pending` — admin-only: list pending accounts (requires Bearer token)
* `POST /admin/approve/{user_id}` — admin approves account (requires Bearer token)
* `POST /admin/reject/{user_id}` — admin rejects account
* `GET /me` — get info about current user

**DB model (SQLAlchemy `models.User`) — fields used:**

```py
id: int (PK)
name: str
email: str (unique)
password_hash: str
role: Enum('admin','user','validator')
organisation: str
industry_type: str (user)  # Industry / STP / WTP / Custom
validator_type: str (validator)  # Govt / Private / AI-enabled
status: str ('pending','approved','rejected')
created_at: datetime
```

**Auth**

* JWT via `jose` (`HS256`), `ACCESS_TOKEN_EXPIRE_MINUTES=1440` default.
* Password hashing uses `passlib` with `pbkdf2_sha256` in the stable branch to avoid native bcrypt build problems in Docker environments.

---

# 8 — Admin and user flows

* **User & Validator registration**:

  1. User/Validator fills registration form (name, email, password, organisation, industry/validator type).
  2. Frontend calls `/register?role=user` (or `role=validator`) on backend.
  3. Backend saves user with `status = "pending"` and sends a registration email (if SMTP configured).
  4. Admin sees pending accounts in admin dashboard and approves/rejects.

* **Admin**:

  * Admin login uses `/auth/admin-login` endpoint (separate page).
  * Admin page is intentionally separate from user/validator login pages. In your frontend the Admin login route is `/admin/login`.
  * Default admin (if not present) is created on backend startup with `email=admin@wqam.local` and `password=admin123`. If that default admin was removed, run the ensure_admin logic or create via DB.

**Default admin credentials (if created by startup script)**:

```
Email: admin@wqam.local
Password: admin123
```

---

# 9 — Admin approval UI + backend

Backend routes are already provided. For the frontend admin approval UI:

* Admin Dashboard should call:

  * `GET ${API_BASE}/admin/pending` with `Authorization: Bearer <token>`
  * Render a table of pending users
  * On approve: `POST ${API_BASE}/admin/approve/${user_id}` with the admin token
  * On reject: `POST ${API_BASE}/admin/reject/${user_id}`

Make sure your admin frontend sends the Authorization header:

```js
fetch(`${API_BASE}/admin/pending`, { headers: { Authorization: `Bearer ${token}` } })
```

---

# 10 — Database access

TimescaleDB / Postgres running inside Docker on host port `5432`.

You can connect from your host with `psql` or a GUI (pgAdmin/DBeaver):

```bash
psql -h localhost -p 5432 -U postgres -d wqam
# password: postgres
```

If using Docker exec into the DB container:

```powershell
docker exec -it timescaledb bash
psql -U postgres -d wqam
```

Check `users` table to see registered accounts.

---

# 11 — Troubleshooting: errors you saw and how to fix them

I collected the errors you posted and the fixes:

1. **Vite / Rollup build errors**:

   * *Could not resolve "./pages/AdminLogin" from "src/App.jsx"*
   * Caused by wrong import paths or filename/case mismatch. Fix: ensure `App.jsx` imports the same path/name as the files in `src/pages/*`. On Linux (Docker build) imports are case-sensitive.

2. **"axios" import not found during build**:

   * Either `axios` missing from `package.json` or installed only locally. Fix: add `axios` to `package.json` dependencies and `npm install` before build.

3. **"default" is not exported** or module missing default export:

   * Ensure each component file ends with `export default ComponentName;`. Example: `export default ValidatorRegister;`.

4. **CSS import missing** (`Could not resolve "./AdminLogin.css"`):

   * Make sure CSS files referenced exist & case matches. If CSS is not necessary, remove import.

5. **Frontend -> Backend network errors in browser** (`ERR_CONNECTION_REFUSED` or `:8000/auth/login`):

   * Check `API_BASE` value in `src/config.js` and Vite env. If your backend runs on 4000, set `VITE_API_BASE_URL=http://localhost:4000` and rebuild frontend. When testing from the browser on the host, `localhost:4000` reaches the backend.

6. **422 Unprocessable Entity on login**:

   * Usually means request body did not match the Pydantic schema. Inspect the network request body in DevTools — ensure JSON keys match expected schema (e.g., `{ "email": "...", "password": "...", "role": "user" }`).

7. **`SyntaxError: source code string cannot contain null bytes`**:

   * You already found and removed files with null bytes. Good — verify all Python files are valid UTF-8 and have no `\x00` bytes.

8. **`bcrypt`/passlib error / ValueError password >72 bytes**:

   * You fixed this by switching to `pbkdf2_sha256` hashing in code (no native bcrypt dependency). If you want bcrypt, the Docker image must include `build-essential` and install the bcrypt wheel. Simpler: `pbkdf2_sha256` is fine for now.

9. **Docker build snapshot / layers not found**:

   * Rare Docker engine cache corruption: run `docker builder prune` and `docker system prune -a --volumes` carefully. You already did cleanup and re-built successfully. If export errors persist, restart Docker Desktop.

10. **Case / folder name mismatch** (`vaildator` vs `validator`) — this was the most common cause of build failures. Standardize the folder name to `validator` and update all imports.

---

# 12 — Next steps & recommendations (DB models, ML, AI)

**DB modeling & migrations**

* Add Alembic for DB migrations (`alembic` + SQLAlchemy).
* Create clearer user, organisation, plant tables. Keep timeseries data separate and write ingestion API to write to TimescaleDB.

**ML service**

* Create a separate microservice `ML` (FastAPI) for:

  * PDF → CSV / OCR (pdfplumber / pytesseract / tabula)
  * Basic ML model for anomaly detection (scikit-learn or a lightweight model)
  * Expose `/predict` and `/train` endpoints
* Containerize it in Docker and add to `docker-compose.yml`.

**Baseline AI model**

* Start with a simple model (random forest / logistic regression) for classifying water quality severity based on feature CSV.
* Export model as `joblib` and call it from ML microservice.

**Email & notifications**

* Configure SMTP env variables or use services like SendGrid. Use MinIO for storing uploaded files.

**Security**

* Move secrets to env and avoid committing them.
* Use HTTPS in production and rotate JWT secret.

---

# 13 — Example `config.js` (drop in `src/`)

```js
// src/config.js
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
export default { API_BASE };
```

When building Docker image of frontend for production, pass `VITE_API_BASE_URL` during build so the static build includes the right backend URL:

```powershell
# Example: build frontend image locally
docker build --build-arg VITE_API_BASE_URL=http://wqam-backend:4000 -t wqam-frontend ./FRONTEND/frontend
```

---

# 14 — Useful commands cheat-sheet (PowerShell)

```powershell
# Build only backend (faster)
docker compose build backend

# Build only frontend
docker compose build frontend

# Recreate frontend only (no deps)
docker compose up -d --no-deps --force-recreate frontend

# Tail logs
docker compose logs -f backend
docker compose logs -f frontend

# Show containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Remove volumes and containers (careful: deletes DB)
docker compose down -v
```

---

# 15 — Final notes / checklist for you (actionable)

1. **Fix folder name spelling**: rename `vaildator` → `validator` (both folder and imports). This will remove many build errors.
2. **Ensure every component exports default** (e.g., `export default ValidatorRegister;`).
3. **Install `axios`** and ensure `package.json` has all dependencies. Then `npm install` before build.
4. **Create `src/config.js`** and point `API_BASE` to `http://localhost:4000` during local dev. Rebuild frontend when env changes.
5. **Check network calls in browser DevTools** for 422/500 responses and correct request shape (JSON property names).
6. **Confirm backend pydantic schemas** (`schemas.py`) match the JSON body your frontend sends.
7. **Use pbkdf2_sha256** hash in backend to avoid `bcrypt` native build issues (you already did).
8. **Admin page separation**: ensure your App routing only shows Admin login at `/admin/login` and not in the main user/validator page.
9. **DB access**: connect `psql` to `localhost:5432` to confirm tables & default admin created.

---

# Appendix — Minimal `docker-compose.override.yml` (place next to docker-compose.yml)

```yaml
services:
  frontend:
    environment:
      - VITE_API_BASE_URL=http://localhost:4000
  backend:
    environment:
      - SECRET_KEY=replace-me
      - SMTP_HOST=
      - SMTP_USER=
      - SMTP_PASS=
```

This file helps override settings for local dev. If you want the frontend to contact the backend container when the frontend itself is running in a container, use `http://wqam-backend:4000` as the `VITE_API_BASE_URL` here (and rebuild).

---

If you want, I’ll:

* Generate a polished `README.md` file with the exact text above (I can create it in the repo if you upload or point to it).
* Produce the corrected `App.jsx`, `src/config.js`, and any missing frontend files (UserRegister, ValidatorRegister) so Vite build passes — I can paste final code for each file here.
* Produce corrected SQLAlchemy `models.py`, `schemas.py`, and `database.py` for the backend and an Alembic migration script.

Which of the above would you like me to do next? (I’ll proceed immediately with the code changes you pick.)
