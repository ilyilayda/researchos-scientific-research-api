# ResearchOS — Scientific Research Workflow API

A research-focused **Node.js + Express.js REST API** with a responsive dashboard for tracking research projects, scientific tasks, team responsibilities, and peer-review revisions.

ResearchOS extends the mandatory TaskFlow-style internship assignment into an academic research scenario without changing its core requirements: task CRUD, Express routing, request logger middleware, and Postman verification. All backend data is stored in a local JSON file to keep installation straightforward.

## Features

- **Mandatory:** Create, list, retrieve, update, and delete scientific tasks using REST endpoints.
- **Mandatory:** Express routing, request timestamp logger, clear code structure, basic Postman examples.
- **Extended:** Projects, researchers, review comments, assignment, status and priority management.
- **Extended:** Task filtering, sorting, search, pagination, validation, and summary reports.
- **Bonus dashboard:** Overview, projects, tasks, revisions, team, and API reference. Create tasks and update task status from the UI.
- **Local persistence:** First startup copies demo records from `data/seed.json` to `data/store.json`. The runtime store is intentionally excluded from Git.

## Requirements

- Node.js 18 or newer (Node.js 20 / 22 LTS recommended)
- npm
- Internet connection for the initial dependency installation (`npm install`)

## Setup (Windows / VS Code)

1. Unzip the project and open the `ResearchOS` folder in VS Code.
2. Select **Terminal > New Terminal** and run:

   ```powershell
   npm install
   npm start
   ```

3. Browse to **http://localhost:3000** for the dashboard.
4. In Postman, call **GET http://localhost:3000/api/health** and expect HTTP `200`.
5. Stop with `Ctrl + C`.

To use another port on PowerShell: `$env:PORT=4000; npm start`. For development, use `npm run dev`.

> `.env.example` is supplied for reference; this beginner-friendly version reads `PORT` and `DATA_FILE` directly from process environment variables and does **not** require dotenv.

## Required task endpoints

| HTTP | Endpoint | Function | Success status |
| --- | --- | --- | --- |
| POST | `/api/tasks` | Create task | 201 |
| GET | `/api/tasks` | List tasks | 200 |
| GET | `/api/tasks/:id` | Task detail | 200 |
| PUT | `/api/tasks/:id` | Update task | 200 |
| DELETE | `/api/tasks/:id` | Delete task | 200 |

Example task creation (`projectId: "prj-001"` exists in the demo dataset):

```http
POST http://localhost:3000/api/tasks
Content-Type: application/json
```

```json
{
  "title": "Revise reviewer methodology comments",
  "description": "Document experimental procedures and update Methods.",
  "projectId": "prj-001",
  "assignee": "Dr. Aylin Demir",
  "priority": "high",
  "type": "revision",
  "status": "todo",
  "dueDate": "2026-11-15"
}
```

Copy the `id` property from the `201 Created` response for task detail, update, and delete calls. The Postman collection does this automatically with a collection variable.

## Additional endpoints

- `/api/projects` — project CRUD; project delete returns `409` if it has tasks/reviews.
- `/api/members` — researcher CRUD.
- `/api/reviews` — peer-review comment CRUD with optional task linking.
- `/api/reports/summary` — research status statistics.
- `/api/reports/projects/:id` — project progress counts.
- `/api/health` — API health check.

Task filters: `GET /api/tasks?status=in_progress&priority=high&projectId=prj-001&search=review&page=1&limit=10&sort=createdAt&order=desc` (combine only the filters you need).

## Postman verification

Import `postman/ResearchOS.postman_collection.json` into Postman. Requests are organized to execute in order: health, create, list, detail, update, delete, negative validation, reports. `baseUrl` defaults to `http://localhost:3000`. Each request includes example assertions; `createdTaskId` is saved after POST and used automatically for later calls.

**Evidence required by the course:** run Postman locally and take actual screenshots of the five task CRUD responses, showing method, URL, JSON response and HTTP status. Place your own captures in `screenshots/`. This folder contains an explicit checklist instead of fictional test screenshots.

## Folder structure

```text
ResearchOS/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── lib/store.js
│   ├── middleware/logger.js
│   ├── middleware/validate.js
│   └── routes/{tasks,projects,members,reviews,reports}.js
├── public/{index.html,style.css,app.js}
├── data/seed.json
├── docs/{Project_Overview.pdf,API_Design.md,Testing_Guide.md}
├── postman/ResearchOS.postman_collection.json
├── screenshots/README.md
├── tests/api.test.js
├── package.json
├── .env.example
└── README.md
```

## Test & reset

```powershell
npm test
```

Tests use a temporary data file and clean it up, so your main demo data is preserved. To reset the demo database, stop the server and delete **`data/store.json`**; restart and it will be reconstructed from `data/seed.json`.

## Architecture / limitations

- Single-process JSON persistence, meant for an internship demonstration, **not** concurrent production writes.
- No login, access control, password management, external academic databases, file uploads, or live multiuser synchronization.
- Demo researchers, experiments, and review comments are **sample records only**, not real scientific findings.
- This is a **working backend + lightweight dashboard**, not a clone of the visual reference application's full feature set.

## Academic submission

The PDF course guide requests a 1–2-page introduction, setup README, true Postman CRUD screenshots, source files, and a **public GitHub repository**. A complete screenshot checklist and test guide are included. `node_modules/` and the local mutable data file must not be committed.

© 2026 ResearchOS — Educational demonstration.
