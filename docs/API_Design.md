# ResearchOS — Data Model & API Design

## Core scenario

An academic research lab supervises multiple parallel research studies. Each study comprises research tasks across five typical phases: literature, experiment, analysis, manuscript, and revision. Assignments are tracked by researchers, priority, deadline, and lifecycle status. Peer-review comments may optionally link to a revision task.

## Entity model

| Entity | Required at creation | Additional fields | Relation |
|---|---|---|---|
| Project | name | description, owner, status, deadline | Has many tasks and review comments |
| Task | title, projectId | description, assignee, status, priority, type, dueDate | Belongs to one project |
| Member | name | role, email | Researchers listed for coordination |
| Review | projectId, comment | reviewer, status, taskId | Belongs to a project; optionally references a task |

All newly created records contain UUID `id`, `createdAt`, and `updatedAt`. Demo records use readable identifiers for ease of student testing.

### Allowed values

- Task `status`: `todo`, `in_progress`, `in_review`, `completed`.
- Task `priority`: `low`, `medium`, `high`, `critical`.
- Task `type`: `literature`, `experiment`, `analysis`, `manuscript`, `revision`, `general`.
- Project `status`: `planning`, `active`, `on_hold`, `completed`.
- Review `status`: `open`, `resolved`.

## API contract

Common behavior: data is JSON; invalid input returns `400`, nonexisting entities return `404`; deleting a project with linked tasks/reviews returns `409`. Create returns `201`. Requests are logged as `[ISO_TIMESTAMP] METHOD PATH`.

### Mandatory tasks CRUD

- `POST /api/tasks` — validates `title`, `projectId`, optional fields, and project reference.
- `GET /api/tasks` — returns `{ data: [...], pagination: {page,limit,total,totalPages} }`.
- `GET /api/tasks/:id` — returns task object.
- `PUT /api/tasks/:id` — allows partial field updates for a given task ID.
- `DELETE /api/tasks/:id` — returns confirmation and removed task; linked review comments retain their record but clear `taskId`.

### Optional supporting modules

- `GET|POST /api/projects` and `GET|PUT|DELETE /api/projects/:id`.
- `GET|POST /api/members` and `GET|PUT|DELETE /api/members/:id`.
- `GET|POST /api/reviews` and `GET|PUT|DELETE /api/reviews/:id`.
- `GET /api/reports/summary`, `GET /api/reports/projects/:id`.

## Workflow example — Reviewer feedback

1. A lab creates a project, such as Explainable AI for Medical Imaging.
2. A reviewer submits a methodology clarification request.
3. A research assistant creates a task with `type: revision`, `priority: high`, `status: todo`.
4. The team associates the reviewer comment with the task ID.
5. The assignee updates the task to `in_progress` and then `completed`.
6. The reviewer comment moves from `open` to `resolved`; the summary endpoint reflects project activity.

## Design decisions

The mandatory scope remains small and easily demonstrated in a five-day Node.js/Express backend training: route modules, one logger middleware, JSON-backed data, and task CRUD. Validation, status filters, metrics, review workflow and a browser interface are transparent extensions, not replacements for the requested core deliverables. Project deletion is intentionally blocked if dependent records exist. No automatic scientific analysis or AI-generated findings are implied.
