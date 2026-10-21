# Changelog Open

> A secure changelog-as-a-service platform. Track project updates beautifully.

**Status:** 🚧 In development. The backend API is under construction; a React frontend is planned.

## Features

- User registration with password hashing (bcrypt)
- Login with JWT authentication and an auth middleware protecting private routes
- Rate limiting on the login route
- Centralized error handling
- Full CRUD for **Projects**
- Full CRUD for **Entries** (releases), nested under projects, with changelog items created through Prisma nested writes
- Health check route

## Tech stack

- **Runtime:** Node.js
- **Framework:** Express
- **ORM:** Prisma (with `@prisma/adapter-better-sqlite3`)
- **Database:** SQLite
- **Auth:** JSON Web Tokens (JWT) and bcrypt

## Data model

```User
 └── Project
      └── Entry        (version, title, publishedAt)
           └── EntryItem   (type, description, order)
```

Entries are listed ordered by `publishedAt`, and each entry holds an ordered list of items (for example: added, fixed, changed).

## Project structure

```backend/
└── src/
    ├── controllers/   # name.controller.js
    ├── routes/        # name.routes.js
    ├── middleware/    # auth and error handling
    └── utils/
```

## Getting started

```bash
# 1. Clone the repository
git clone https://github.com/gustavodeoliveiradev/changelog-open.git
cd changelog-open/backend

# 2. Install dependencies
npm install

# 3. Create your environment file (see the example below)
cp .env.example .env

# 4. Apply the database migrations
npx prisma migrate dev

# 5. Start the server
npm run dev
```

Example `.env` (use your own values and never commit this file):

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="replace-with-a-long-random-string"
PORT=3000
```

## API endpoints

| Method | Route | Auth | Description |
| ------ | ----- | :--: | ----------- |
| GET | `/health` | No | Health check |
| POST | `/api/auth/register` | No | Create a user account |
| POST | `/api/auth/login` | No | Log in and receive a JWT (rate limited) |
| GET, POST | `/api/projects` | Yes | List and create projects |
| GET, PUT, DELETE | `/api/projects/:projectId` | Yes | Get, update and delete a project |
| GET, POST | `/api/projects/:projectId/entries` | Yes | List and create entries of a project |
| GET, PUT, DELETE | `/api/projects/:projectId/entries/:entryId` | Yes | Get, update and delete an entry |

Protected routes expect the header `Authorization: Bearer <token>`.

## Roadmap

- [x] Express setup and health check
- [x] Prisma schema (User, Project, Entry, EntryItem)
- [x] User registration with bcrypt
- [x] Login with JWT and auth middleware
- [x] Rate limiting and centralized error handler
- [x] CRUD for Projects
- [x] CRUD for Entries with nested items
- [ ] Public route `GET /api/public/:slug` to expose a changelog without authentication
- [ ] React frontend

## Author

**Luis Gustavo de Oliveira**
GitHub: [@gustavodeoliveiradev](https://github.com/gustavodeoliveiradev)
LinkedIn: [linkedin.com/in/lgustavodeoliveira](https://linkedin.com/in/lgustavodeoliveira)

## License

See the [LICENSE](./LICENSE) file.
