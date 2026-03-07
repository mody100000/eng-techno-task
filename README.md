# Sprint Board Monorepo

Production URL: [https://2e94-44-210-109-165.ngrok-free.app/sprint-board](https://2e94-44-210-109-165.ngrok-free.app/sprint-board)

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker

## Tech Stack

### Backend (`apps/api`)

- Express 5
- Prisma ORM 7
- SQLite (`better-sqlite3` + `@prisma/adapter-better-sqlite3`)
- Zod (request validation)
- `express-rate-limit` (archive toggle protection)
- TypeScript + tsx

### Frontend (`apps/web`)

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Axios + Fetch
- `react-toastify`
- `moment`
- `lucide-react`

## Project Structure

```text
.
├── apps
│   ├── api
│   │   ├── prisma
│   │   │   ├── migrations
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   ├── src
│   │   │   ├── controllers
│   │   │   ├── routes
│   │   │   ├── schemas
│   │   │   ├── services
│   │   │   ├── utils
│   │   │   ├── lib
│   │   │   └── index.ts
│   │   └── prisma.config.ts
│   └── web
│       ├── src
│       │   ├── app
│       │   │   └── sprint-board
│       │   ├── components
│       │   ├── constants
│       │   ├── lib
│       │   ├── types
│       │   └── utils
│       └── public
├── docker
│   ├── nginx.conf
│   └── start.sh
├── Dockerfile
└── package.json
```

## Local Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create `apps/api/.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
DEFAULT_USER_NAME="Mahmoud Gomaa"
CORS_ORIGINS="http://localhost:3000,http://localhost,http://127.0.0.1,https://2e94-44-210-109-165.ngrok-free.app"
PORT=5000
```

3. Run Prisma setup:

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

4. Start both apps:

```bash
pnpm dev
```

5. Open:

- Frontend: `http://localhost:3000/sprint-board`
- API: `http://localhost:5000`

## Docker Setup

Build and run:

```bash
docker build -t sprint-board .
docker run --rm -p 8080:80 -v $(pwd)/apps/api/prisma:/app/apps/api/prisma sprint-board
```

Open:

- App (Nginx): `http://localhost:8080/sprint-board`
- API is proxied under: `http://localhost:8080/api/*`

## Backend API Endpoints

Base URL locally: `http://localhost:5000/api`

- `GET /tasks`
  - Query: `page`, `pageSize`, `status`, `priority`, `category`, `search`, `userAssigned`
  - Returns paginated tasks.
- `GET /tasks/:id`
  - Returns single task details.
- `POST /tasks`
  - Body: `title`, `description`, `status`, `priority`, `category`, `startDate`, `dueDate`, `assignedToId`
  - Creates task.
- `PATCH /tasks/:id`
  - Body: same as create (supports full update + assignee change)
  - Updates task and writes activity.
- `PATCH /tasks/:id/assign`
  - Body: `assignedToId` (`string | null`)
  - Assign/unassign task and writes activity.
- `PATCH /tasks/:id/archive/toggle`
  - Toggle archive/restore (rate-limited: 5 requests/minute).
- `POST /comments`
  - Body: `taskId`, `message`
  - Adds comment to task timeline.
- `GET /comments/task/:taskId/timeline`
  - Returns combined comments + activities sorted by datetime.
- `GET /users`
  - Returns assignable users.

## Features

### Backend

- Task CRUD flow (create, list with filters/pagination, details, update).
- Assign/unassign and archive/restore actions.
- Activity logging for task events.
- Timeline aggregation (comments + activity logs).
- Zod validation and normalized validation errors.
- Rate limiting for archive toggle endpoint.

### Frontend

- Sprint board list grouped by status.
- Filtering, searching, and pagination.
- Create and edit task modal.
- Task details page with status/priority/category metadata.
- Assign user from sidebar.
- Comments & activity timeline with optimistic comment posting.
- Archive/restore actions with rate-limit error handling toast.
