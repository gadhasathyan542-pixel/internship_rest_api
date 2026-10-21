# Internship Records REST API

Beginner-friendly Node.js + Express API with SQLite persistence, validation, pagination, search, and consistent JSON errors.

## Requirements
Install Node.js 18+ and npm.

## Run locally
```bash
npm install
npm run seed
npm start
```
Open `http://localhost:3000` and `http://localhost:3000/api/health`.

## Endpoints
| Method | URL | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/domains` | Valid domains |
| GET | `/api/internships?page=1&limit=5` | List with pagination |
| GET | `/api/internships?domain=Development` | Filter by domain |
| GET | `/api/internships?search=Python` | Search |
| GET | `/api/internships/:id` | Detail |
| POST | `/api/internships` | Create |
| PUT | `/api/internships/:id` | Update |
| DELETE | `/api/internships/:id` | Delete |

## Example POST body
Choose Body > raw > JSON in Postman:
```json
{
  "title": "Python Developer Intern",
  "company": "Example Labs",
  "domain": "Development",
  "location": "Remote",
  "duration": "8 weeks",
  "stipend": "₹8,000/month",
  "description": "Learn Python and build small features with a mentor."
}
```
Valid domains: `Development`, `Design`, `Data & AI`, `Marketing`, `Cybersecurity`, `Business`.

## Response format
Success: `{"success":true,"data":{...}}`. List responses also include pagination metadata.
Error: `{"success":false,"error":{"code":"NOT_FOUND","message":"Internship record not found."}}`.

## Status codes
- 200: successful read, update, or delete
- 201: created
- 400: invalid input, ID, pagination, or JSON
- 404: record or route not found
- 500: unexpected server error

## Database
SQLite file is created at `data/internships.db` after starting the API. Seed adds fictional examples only when the database is empty.

## Test using Postman
1. Start the server.
2. GET `http://localhost:3000/api/health`.
3. GET `http://localhost:3000/api/internships?page=1&limit=3`.
4. POST to `http://localhost:3000/api/internships` with the JSON above.
5. Use the returned ID for GET, PUT, and DELETE.

## Deployment note
GitHub Pages only hosts static files; it does not run Node.js servers. For a live API, deploy to a Node.js host with persistent storage or use managed PostgreSQL. If Edvyro accepts source-code proof, submit this public GitHub repository and include a live API URL if the task guide asks for one.
