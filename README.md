# 🚀 Team Task Manager (MERN)

A production-ready full-stack **Team Task Management Web Application** built using the MERN stack.  
This project was developed as part of a **placement drive assessment for Ethara.AI**.

🌐 **Live Frontend:** https://team-task-manager-f4ar.onrender.com  
⚙️ **Backend API:** https://team-task-manager-8wdc.onrender.com  

---

## 📌 Overview

This application enables teams to collaborate efficiently by managing projects and tasks with **role-based access control (RBAC)**.

It is inspired by tools like **Trello** and **Asana**, focusing on real-world workflows, scalability, and usability.

---

## 🏗️ Project Structure

```
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── server.js
├── srcApp.js
├── package.json

frontend/
├── src/
│ ├── api/
│ ├── components/
│ ├── context/
│ ├── pages/
│ ├── utils/
│ ├── App.jsx
│ ├── main.jsx
│ └── styles.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js

```

---

## ✨ Features

### 🔐 Authentication & Security
- Signup & login with email/password  
- Password hashing using bcrypt  
- JWT-based authentication  
- Secure API access using `Authorization: Bearer <token>`  

### 👥 Role-Based Access Control
- **Admin**
  - Create projects  
  - Add/remove members  
  - Create, assign, and delete tasks  
- **Member**
  - View assigned projects and tasks  
  - Update task status only  

### 📁 Project & Task Management
- Create and manage projects  
- Assign tasks to team members  
- Track task progress:
  - To Do  
  - In Progress  
  - Done  

### 📊 Dashboard
- Total tasks  
- Tasks grouped by status  
- Tasks per user  
- Overdue tasks detection  

---

## ⚙️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** JWT, bcrypt  
- **Deployment:** Render  

---

## 🧪 Local Setup

### 🔹 Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
Environment Variables (backend/.env)
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173

Backend runs at: https://team-task-manager-8wdc.onrender.com

```

---


🔹 Frontend Setup

```
cd frontend
npm install
cp .env.example .env
npm run dev
Environment Variables (frontend/.env)
VITE_API_URL=http://localhost:5000/api

Frontend runs at: https://team-task-manager-f4ar.onrender.com

```

---

## 🔗 API Endpoints

# 🔐 Auth
* POST /api/auth/register
* POST /api/auth/login
* GET /api/auth/me

# 📁 Projects

* POST /api/projects (Admin)
* GET /api/projects
* PUT /api/projects/:id/add-member (Admin)
* DELETE /api/projects/:id/remove-member (Admin)

# 📝 Tasks

* POST /api/tasks (Admin)
* GET /api/tasks
* PUT /api/tasks/:id
* DELETE /api/tasks/:id (Admin)

# 📊 Dashboard

* GET /api/dashboard

# 👤 Users

* GET /api/users

---

## 🔄 Application Flow

# 🔐 Authentication

* User registers with role (Admin/Member)
* Password is hashed using bcrypt
* Login returns JWT token
* Token is used in protected API requests

# 🧠 Role-Based Access

* Middleware verifies JWT
* Role-based authorization restricts access
* UI adapts based on user role

# 📁 Task Workflow

* Admin creates project
* Adds members
* Assigns tasks
* Members update task status

# 📊 Dashboard

* Aggregates task data
* Tracks progress
* Identifies overdue tasks

--- 

# 📌 Assignment Context

This project was built as part of a pre-placement assignment for Ethara.AI, demonstrating:

* Full-stack development
* REST API design
* Authentication & authorization
* Deployment and debugging

👨‍💻 Author
Krishnakant Kushwaha
B.Tech CSE | Full-Stack Developer
https://github.com/KRISHNAKANT-KUSHWAHA/
