# Event Management System (EMS)

Production-ready MERN event management system with JWT authentication, role-based access, event registration, ticket generation, and Docker support.

## Folder Structure

```text
/ems-project
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── scripts/
│       ├── utils/
│       └── validators/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
├── docker-compose.yml
├── mongo-init.js
├── .env.example
└── README.md
```

## Features

- User registration and login with JWT authentication
- Role-based access for admin, organizer, and attendee
- Event CRUD for organizers and admins
- Event browsing with search, filters, and pagination
- Event details page with schedule view
- Online event registration and booking
- PDF ticket generation with QR code
- Admin dashboard with user and event management
- Responsive Bootstrap 5 UI with custom styling
- Toast notifications and loading states

## Tech Stack

- Frontend: React, Vite, React Router v6, Bootstrap 5, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Containerization: Docker, Docker Compose
- Validation: Joi
- Auth: bcryptjs, JWT

## Prerequisites

- Node.js 20+
- Docker and Docker Compose
- MongoDB if running without Docker

## Environment Variables

Copy [.env.example](.env.example) to your local environment files and adjust values as needed.

### Backend

- `NODE_ENV`: Runtime mode (`development` or `production`)
- `PORT`: Backend port
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret used to sign JWTs
- `JWT_EXPIRE`: JWT expiration, for example `7d`
- `FRONTEND_URL`: Allowed frontend origin for CORS
- `ADMIN_EMAIL`: Seeded admin email used by the seed script
- `ADMIN_PASSWORD`: Seeded admin password used by the seed script

### Docker / MongoDB

- `MONGO_ROOT_USERNAME`: MongoDB root username for the container
- `MONGO_ROOT_PASSWORD`: MongoDB root password for the container
- `MONGO_DB_NAME`: Database name initialized inside MongoDB

### Frontend

- `VITE_API_URL`: API base URL used by the React app

## Local Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` to the backend, so `VITE_API_URL` can stay at `/api` during local development.

## Docker Setup

Run the full stack with MongoDB using Docker Compose:

```bash
docker-compose up --build
```

Services:

- `mongodb` on port `27017`
- `backend` on port `5000`

The compose setup mounts an uploads volume so generated tickets persist across restarts.

## Seed Admin Account

Create an admin user after setting your environment variables:

```bash
cd backend
npm run seed:admin
```

If you use Docker, run the script against the backend container or seed the user with your preferred deployment workflow.

## How to Run

1. Start MongoDB or use Docker Compose.
2. Configure backend environment variables.
3. Start the backend server.
4. Start the frontend Vite app.
5. Register as an attendee or organizer.
6. Log in as admin to manage users and events.

## Deployment Guide

### Backend on Render or Railway

1. Deploy the `backend/` directory as the service root.
2. Set `NODE_ENV=production` and provide `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, and `FRONTEND_URL`.
3. Set the start command to `npm start`.
4. Connect a managed MongoDB instance or Atlas cluster.

### Frontend on Vercel

1. Deploy the `frontend/` directory.
2. Set `VITE_API_URL` to the deployed backend URL, for example `https://ems-api.onrender.com/api`.
3. Rebuild the app after setting the environment variable.

### Combined Deployment Pattern

- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas or managed MongoDB

Update the backend `FRONTEND_URL` to match the deployed frontend domain and ensure CORS allows that origin.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`
- `POST /api/events/:id/register`
- `GET /api/registrations/me`
- `GET /api/registrations/:id/ticket`
- `GET /api/admin/dashboard`
- `GET /api/admin/users`

## Notes

- The frontend uses a Vite dev proxy for `/api` in local development.
- PDF tickets are generated on the backend and can be downloaded from the profile page or event details page.
- Organizer and admin dashboards share the same underlying event APIs, with access control enforced on the backend.