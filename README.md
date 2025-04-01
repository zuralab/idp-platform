# 🛠 Internal Developer Platform (IDP)

A full-featured Internal Developer Platform built with **NestJS**, **React**, **Docker**, and **PostgreSQL**. It enables:

- 👨‍💻 Developers to deploy mock services and see deployment logs.
- 👨‍🏫 Team Leads to monitor, restart, and remove deployments.
- 👩‍💼 Admins to manage users and assign roles.

---

## 📦 Tech Stack

- **Backend**: NestJS + TypeORM + PostgreSQL
- **Frontend**: React + MUI
- **Auth**: JWT + Role-Based Access Control
- **Containerization**: Docker + Docker Compose
- **Proxy**: Nginx

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/zuralab/idp-platform
cd idp
```

### 2. Copy Environment File

```bash
cp backend/.env.example backend/.env
```

Update `.env` with your local settings if needed.

---

## 🐳 Start with Docker

```bash
docker-compose up --build
```

> This installs `node_modules`, builds the app, starts backend on `localhost:5001`, frontend on `localhost:3000`, and database on `5433`.

---

## 🧱 Run Migrations & Seeders

After the containers are up:

```bash
# Run database migrations
docker exec -it idp-backend sh -c "npm run migration:run"

# Seed default users
docker exec -it idp-backend sh -c "npm run seed:run"
```

Creates 3 users:

| Role      | Email              | Password  |
|-----------|--------------------|-----------|
| Admin     | admin@example.com  | password  |
| Team Lead | lead@example.com   | password  |
| Developer | dev@example.com    | password  |

---

## 🔐 Auth & Roles

- JWT-based authentication
- RBAC enforced in both frontend and backend
- Roles:
  - `admin`
  - `team_lead`
  - `developer`

---

## 🌐 Frontend Access

- Go to: [http://localhost](http://localhost)
- Login with seeded users
- You will be redirected to role-based dashboards:
  - Developer: `/dashboard`
  - Team Lead: `/monitor`
  - Admin: `/admin/users`

---

## 💡 Features by Role

| Feature                  | Developer | Team Lead | Admin |
|--------------------------|-----------|-----------|-------|
| Deploy service           | ✅        | ❌        | ❌    |
| View logs                | ✅        | ✅        | ❌    |
| Restart/Remove service   | ❌        | ✅        | ✅    |
| List all users           | ❌        | ❌        | ✅    |
| Create/Update/Delete users | ❌      | ❌        | ✅    |

---

## 📁 Directory Structure

```
backend/
  ├── src/
  │   ├── auth/
  │   ├── users/
  │   ├── deployments/
  │   ├── monitor/
  │   └── admin/
frontend/
  └── src/
      ├── pages/
      ├── components/
      ├── auth/
      └── routes/
```

---

## ✨ Optional Enhancements Implemented

- ✅ Confirmation modals for destructive actions
- ✅ Snackbar feedback (success/error)
- ✅ 404 and fallback routes
- ✅ Responsive layout using MUI
- ✅ Automatic login redirect
- ✅ Logs in modals with timestamp

---

## 🧪 Testing (Optional)

```bash
# Run backend tests (if written)
npm run test
```

---

## 📦 Deployment (Optional)

You can deploy using:

- [Render](https://render.com/)
- [Railway](https://railway.app/)
- [Vercel](https://vercel.com/) (for frontend)

---

## 👨‍💻 Author

Built with ❤️ by Zura Labadze for test assignment.
