# 🚀 Team Task Manager (MERN)

A production-ready full-stack **Team Task Management Web Application** built using the MERN stack.  
This project was developed as part of a **pre-placement assignment for Ethara.AI**.

🔗 **Live Demo:** https://team-task-manager-f4ar.onrender.com/

---

## 📌 Overview

This application allows teams to collaborate efficiently by managing projects and tasks with **role-based access control**.

It is inspired by tools like **Trello** and **Asana**, focusing on real-world workflow and usability.

---



## Folder Structure

```text
frontend/
backend/
```

## Features

- Signup and login with email/password
- Password hashing with bcrypt
- JWT authentication stored in localStorage
- Admin and Member roles
- Admins can create projects, manage project members, create tasks, assign tasks, and delete tasks
- Members can view their assigned projects/tasks and update task status only
- Dashboard with total tasks, tasks by status, tasks per user, and overdue tasks
- Axios API integration with `Authorization: Bearer <token>`
- Railway-compatible backend configuration through environment variables

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Set these variables in `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173
```

Backend API runs at:

```text
http://localhost:5000
```

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set this variable in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Frontend runs at:

```text
http://localhost:5173
```

## API Routes

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Projects:

- `POST /api/projects` Admin only
- `GET /api/projects`
- `PUT /api/projects/:id/add-member` Admin only
- `DELETE /api/projects/:id/remove-member` Admin only

Tasks:

- `POST /api/tasks` Admin only
- `GET /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id` Admin only

Dashboard:

- `GET /api/dashboard`

Users:

- `GET /api/users`

## Deployment

### Backend on Railway

1. Create a Railway project.
2. Connect the repository.
3. Select the `backend` folder as the service root.
4. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
5. Railway will run `npm install` and `npm start`.

### Frontend on Vercel, Netlify, or Railway

1. Select the `frontend` folder as the app root.
2. Add `VITE_API_URL` with the deployed backend URL plus `/api`.
3. Build command: `npm run build`
4. Output directory: `dist`

Deployment link:

```text
Add your deployed frontend/backend links here.
```

## Demo Explanation

Authentication:

- A user signs up with name, email, password, and role.
- The backend hashes the password and stores the user.
- Login returns a JWT token, which the frontend saves in localStorage.
- Axios sends the token on protected requests.

Role-based access:

- Admin-only routes are protected by JWT verification and role authorization middleware.
- Admin UI controls appear only for Admin users.
- Member users see only their assigned projects/tasks and can update task status only.

Task workflow:

- Admin creates projects and adds members.
- Admin creates tasks inside projects and assigns them to users.
- Members move assigned tasks through `To Do`, `In Progress`, and `Done`.

Dashboard:

- Shows total tasks.
- Groups tasks by status.
- Shows tasks assigned per user.
- Lists overdue tasks where `dueDate` is before today and status is not `Done`.
