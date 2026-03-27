# Kunj Tech Agency - Workspace Portal

A production-ready, role-based software management portal built to facilitate seamless collaboration between clients, employees, and administrators. Features include real-time secure communications, MongoDB GridFS file storage, and a service request pipeline.

**Live Deployment:** [Live Link](https://kunj-tech-agency-management-portal.vercel.app).

**GitHub Repository:** [Github Repo](https://github.com/KunjYadav/Kunj-Tech-Agency-management-portal.git).

---

## 🔑 Test Login Credentials

To evaluate the system's Role-Based Access Control (RBAC), please use the following test accounts:

**Admin Account** (Full access, team provisioning, request approval)

* **Email:** <admin@kunjtech.com>
* **Password:** admin123

**Employee Account** (Assigned project execution, progress updates)

* **Email:** <employee@kunjtech.com>
* **Password:** employee123

**Client Account** (Submit requests, view project progress, billing)

* **Email:** <client@kunjtech.com>
* **Password:** client123

*(Note: If testing locally from scratch, navigate to `/admin/setup` to create the initial master admin).*

---

## 🛠 Tech Stack

### Frontend (Client)

* **Framework:** Next.js 16 (App Router)
* **Styling:** Tailwind CSS v4
* **State & Fetching:** React Hooks, Axios
* **Real-time:** Socket.io-client
* **Icons:** Lucide React

### Backend (Server)

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **File Storage:** MongoDB GridFS (via Multer memory streams)
* **Authentication:** JSON Web Tokens (JWT) via secure `HttpOnly` cookies
* **Real-time:** Socket.io

---

## 🗄️ Database Setup

This project uses **MongoDB** as its primary database and **GridFS** for storing large attachments and user avatars directly in the database (bypassing the standard 16MB document limit).

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Under "Database Access", create a user and password.
3. Under "Network Access", allow access from anywhere (`0.0.0.0/0`) for testing.
4. Copy your connection string (URI) and replace `<username>` and `<password>`.
5. The GridFS `uploads` bucket will be initialized automatically upon the first file upload.

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-directory>
````

### 2\. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development

# Replace with your actual MongoDB URI
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/kunj_tech_agency"

# Generate a random string for JWT encryption
JWT_SECRET=super_secret_jwt_key_123

# The URL of your frontend application
FRONTEND_URL=http://localhost:3000
```

Start the backend server:

```bash
npm run dev
```

### 3\. Frontend Setup

Open a new terminal window, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
# URL for your backend API endpoints
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Base URL for WebSockets and static file routes
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

Start the Next.js development server:

```bash
npm run dev
```

The application will now be running at `http://localhost:3000`.

---

## 🚀 Initializing the System (First Run)

To securely set up the system, you must create the initial Administrator account.

1. Ensure both the frontend and backend are running.
2. Navigate to `http://localhost:3000/admin/setup` in your browser.
3. Create your master Admin account.
4. You will be redirected to the Admin Login gateway (`/admin/login`). Log in using your new credentials.
5. From the Admin Dashboard, you can navigate to **Command Center (Team)** to begin provisioning `Employee` accounts or managing `Client` registrations.

---

## 📁 Project Structure Overview

```text
├── backend/
│   ├── controllers/      # Route logic (auth, projects, requests, etc.)
│   ├── middleware/       # JWT Cookie verification & Role authorization
│   ├── models/           # Mongoose schemas (User, Project, Message, etc.)
│   ├── routes/           # Express API route definitions
│   └── index.js          # Server entry point, Socket.io & GridFS initialization
│
└── frontend/
    ├── app/              # Next.js App Router (Pages & Layouts)
    │   ├── (auth)/       # Public login/register routes
    │   ├── (dashboard)/  # Protected workspace routes
    │   └── admin/        # Admin-specific gateways
    ├── components/       # Reusable UI components (Modals, Tables, Charts)
    ├── context/          # React Context (AuthContext)
    └── public/           # Static assets (SVGs, icons)
```

---

## 📸 Screenshots

*(Replace the placeholder links below with actual screenshots of your running app)*

### 1\. Dashboard (Admin View)

### 2\. Project Details & Secure Communications

### 3\. Service Request Pipeline

### 4\. Team Provisioning (Command Center)

-----

*Developed by Kunj Yadav.*
# Kunj-Tech-Agency-management-portal
