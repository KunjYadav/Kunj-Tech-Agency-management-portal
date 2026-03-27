# Kunj Tech Agency - Workspace Portal

A production-ready, role-based software management portal built to facilitate seamless collaboration between clients, employees, and administrators. Features include real-time secure communications, MongoDB GridFS file storage, and a service request pipeline.

**Live Deployment:** [Live Link](https://kunj-tech-agency-management-portal.vercel.app/).

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

### 1\. Dashboard (Admin View)

<img width="1280" height="616" alt="Image" src="https://github.com/user-attachments/assets/0376703e-3c17-4ae2-b575-e34dd512ff0c" />

### 2\. Project Details & Secure Communications

<img width="1280" height="618" alt="Image" src="https://github.com/user-attachments/assets/b364b263-96cb-447e-8706-67006511d46a" />
<img width="1280" height="621" alt="Image" src="https://github.com/user-attachments/assets/6a0526ae-a5e1-4ba2-a0f4-40274ecc471e" />
<img width="1280" height="598" alt="Image" src="https://github.com/user-attachments/assets/0a8e637b-1443-462b-b676-c9bda1102e5e" />
<img width="1280" height="617" alt="Image" src="https://github.com/user-attachments/assets/42ee84e8-9a89-40f3-883c-f768508313c7" />

### 3\. Service Request Pipeline

<img width="1280" height="594" alt="Image" src="https://github.com/user-attachments/assets/c379c1f9-8eae-456d-8119-62b1e3177d1d" />
<img width="1281" height="623" alt="Image" src="https://github.com/user-attachments/assets/7b180942-4d88-4fd0-a9ed-6cfe77fd93c4" />
<img width="1280" height="619" alt="Image" src="https://github.com/user-attachments/assets/8fb228b1-e23c-4f5b-bc19-2e498073ea4f" />
<img width="1280" height="620" alt="Image" src="https://github.com/user-attachments/assets/857e1747-4277-46a1-9ae3-115c05453a11" />

### 4\. Team Provisioning (Command Center)

<img width="1281" height="591" alt="Image" src="https://github.com/user-attachments/assets/9fa27aa7-57c1-4849-b55b-4f7d5a2c6618" />

-----

*Developed by Kunj Yadav.*

# Kunj-Tech-Agency-management-portal
