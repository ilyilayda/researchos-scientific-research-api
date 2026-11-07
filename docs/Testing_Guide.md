# Postman Verification and Submission Evidence

## Preflight

1. In VS Code terminal run `npm install` and `npm start`.
2. Open Postman and import `postman/ResearchOS.postman_collection.json`.
3. Confirm collection variable `baseUrl = http://localhost:3000`.
4. Send `01 Health Check` first (expected `200`).
5. In order, run `02 Create Task` → `03 List Tasks` → `04 Task Details` → `05 Update Task` → `06 Delete Task`.

The create request script writes the returned task ID into the `createdTaskId` collection variable automatically. Avoid manually copying unrelated seed IDs. The tests check HTTP status and key response fields.

| Screenshot file | Postman request | Expected result |
|---|---|---|
| `01-create-task.png` | POST `/api/tasks` | HTTP 201; JSON includes id, title, and projectId |
| `02-list-tasks.png` | GET `/api/tasks` | HTTP 200; `data` array includes the created task |
| `03-task-details.png` | GET `/api/tasks/{{createdTaskId}}` | HTTP 200; detail object |
| `04-update-task.png` | PUT `/api/tasks/{{createdTaskId}}` | HTTP 200; `status: completed` |
| `05-delete-task.png` | DELETE `/api/tasks/{{createdTaskId}}` | HTTP 200; deletion message and removed record |

### Important

The PDF assignment explicitly requires Postman **screenshots showing successful runs**. Files in `screenshots/` must be genuine screenshots you capture while running the API; placeholder documentation alone does not satisfy this requirement.

## Additional verification

- Run `07 Missing Title (400)` and check HTTP 400.
- Run `08 Missing Task (404)` and check HTTP 404.
- Run `09 Summary Report (200)` and inspect aggregate counts.
- Run `npm test` to check API behavior with automated tests.

## Suggested screenshot framing

In each capture, show the Postman method selector, full request URL, relevant request body (for POST and PUT), response status (e.g., `201 Created`), and response JSON. Use full-size legible captures, not cropped response fragments.
