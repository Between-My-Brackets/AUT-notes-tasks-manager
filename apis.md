# API Endpoints

## Base URL
`http://localhost:3000/api`

## Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Login user | No |
| `GET` | `/auth/me` | Get current logged in user | Yes |

## Users (Admin Only)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | Get all users | Yes (Admin) |
| `POST` | `/users` | Create user | Yes (Admin) |
| `GET` | `/users/:id` | Get single user | Yes (Admin) |
| `PUT` | `/users/:id` | Update user | Yes (Admin) |
| `DELETE` | `/users/:id` | Delete user | Yes (Admin) |

## Notebooks
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/notebooks` | Get user's notebooks | Yes |
| `POST` | `/notebooks` | Create notebook | Yes |
| `GET` | `/notebooks/:id` | Get single notebook | Yes |
| `PUT` | `/notebooks/:id` | Update notebook | Yes |
| `DELETE` | `/notebooks/:id` | Delete notebook (fails if open tasks exist) | Yes |

## Notes
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/notes` | Get all notes | Yes |
| `GET` | `/notebooks/:notebookId/notes` | Get notes for a notebook | Yes |
| `POST` | `/notebooks/:notebookId/notes` | Create note in notebook | Yes |
| `GET` | `/notes/:id` | Get single note | Yes |
| `PUT` | `/notes/:id` | Update note | Yes |
| `DELETE` | `/notes/:id` | Delete note | Yes |

## Tasks
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | Get all tasks | Yes |
| `GET` | `/notebooks/:notebookId/tasks` | Get tasks for a notebook | Yes |
| `POST` | `/notebooks/:notebookId/tasks` | Create task in notebook | Yes |
| `GET` | `/tasks/:id` | Get single task | Yes |
| `PUT` | `/tasks/:id` | Update task | Yes |
| `DELETE` | `/tasks/:id` | Delete task | Yes |

## Audit Logs (Admin Only)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/audit-logs` | Get all audit logs | Yes (Admin) |
| `POST` | `/audit-logs` | Create manual log | Yes (Admin) |
| `DELETE` | `/audit-logs` | Clear all logs | Yes (Admin) |
| `GET` | `/audit-logs/:id` | Get single log | Yes (Admin) |
| `PUT` | `/audit-logs/:id` | Update log | Yes (Admin) |
| `DELETE` | `/audit-logs/:id` | Delete single log | Yes (Admin) |
| `GET` | `/audit-logs/entity/:entity` | Filter logs by entity | Yes (Admin) |
| `*` | `/audits/*` | Alias for `/audit-logs/*` | Yes (Admin) |
