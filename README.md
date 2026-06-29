# To-Do List Website

A full-stack task management app built with React on the frontend and Node.js/Express on the backend, backed by MongoDB. Users can register, log in, and manage their personal to-do list — all data is scoped per user via JWT authentication.

---

## Features

- User registration and login (JWT-based, tokens valid for 7 days)
- Add, edit, delete, and toggle tasks
- Filter tasks by All / Active / Completed
- Optimistic UI updates for a snappy experience
- Guest users can start typing a task — they're prompted to sign in and the task is saved automatically after auth
- Persistent storage in MongoDB (each user only sees their own tasks)

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 19 | UI library |
| Vite | Build tool & dev server |
| lucide-react | Icons |
| oxlint | Linting |

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Mongoose | MongoDB ODM |
| jsonwebtoken | JWT auth |
| bcryptjs | Password hashing |

---

## Project Structure

```
to_do_list_website/
├── backend/
│   ├── database.js          # MongoDB connection & Todo model
│   ├── server.js            # Express app & todo routes
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── models/
│   │   └── User.js          # User model
│   └── routes/
│       └── auth.js          # /api/auth/register & /api/auth/login
└── frontend/
    ├── src/
    │   ├── App.jsx           # Root component, state & API calls
    │   ├── components/
    │   │   ├── AuthModal.jsx # Login / Register modal
    │   │   ├── FilterBar.jsx # All / Active / Completed filter
    │   │   ├── TodoInput.jsx # New task input
    │   │   ├── TodoItem.jsx  # Single task row
    │   │   └── TodoList.jsx  # Task list container
    │   ├── App.css
    │   └── index.css
    ├── index.html
    └── vite.config.js
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on the default port `27017`

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd to_do_list_website
```

### 2. Start the backend

```bash
cd backend
npm install
npm start
```

The API server will start on `http://localhost:5000`.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server will start on `http://localhost:5173` (or the next available port).

---

## API Reference

All todo endpoints require an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in and receive a JWT |

**Register body:**
```json
{ "username": "string", "email": "string", "password": "string (min 6 chars)" }
```

**Login body:**
```json
{ "email": "string", "password": "string" }
```

Both return:
```json
{ "token": "jwt_string", "user": { "id": "...", "username": "...", "email": "..." } }
```

### Todos

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/todos` | Get all todos for the logged-in user |
| `POST` | `/api/todos` | Create a new todo |
| `PUT` | `/api/todos/:id` | Update a todo (text or completed status) |
| `DELETE` | `/api/todos/:id` | Delete a todo |

---

## Environment Variables

Create a `backend/.env` file before starting the server:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/todolist?retryWrites=true&w=majority
JWT_SECRET=your_strong_secret_here
PORT=5000
```

| Variable | Default | Description |
|---|---|---|
| `MONGODB_URI` | local MongoDB fallback | MongoDB Atlas (or local) connection string |
| `JWT_SECRET` | `todo_jwt_secret_key_change_in_production` | Secret used to sign JWTs |
| `PORT` | `5000` | Port the Express server listens on |

> **Important:** Never commit `.env` to version control. The root `.gitignore` already excludes it.

---

## Scripts

### Backend
```bash
npm start        # Start the server with node
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview the production build
npm run lint     # Run oxlint
```
