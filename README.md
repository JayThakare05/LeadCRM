# 🎯 LeadCRM — Lead Management System

A full-stack CRM application for managing sales leads through the entire pipeline. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js).


---

## ✨ Features

- **Complete Lead Management** — Create, Read, Update, Delete leads
- **Pipeline Tracking** — Track leads through: New → Contacted → Qualified → Converted / Lost
- **Smart Search** — Real-time search across name, email, and company (300ms debounce)
- **Filter & Sort** — Filter by status, sort by name/company/date in either direction
- **Dashboard Stats** — Live count cards for total, converted, qualified, and lost leads
- **Pagination** — Server-side pagination with page navigation and result count
- **Responsive Design** — Full table on desktop, card layout on mobile
- **Delete Confirmation** — Modal prompt before any delete action
- **Toast Notifications** — Success/error feedback on all actions
- **Duplicate Detection** — Prevents duplicate email addresses
- **Form Validation** — Client-side + server-side validation with inline error messages

---

## 🔑 Demo Credentials

For testing and previewing the system, you can use the pre-created test account:

- **Username**: `test`
- **Password**: `test123`

---

## 🛠 Tech Stack

| Layer     | Technology            | Version |
|-----------|-----------------------|---------|
| Frontend  | React.js + Vite       | 18.x    |
| Routing   | React Router DOM      | 6.x     |
| HTTP      | Axios                 | 1.x     |
| Icons     | Lucide React          | 0.x     |
| Toasts    | React Hot Toast       | 2.x     |
| Backend   | Node.js + Express.js  | 4.x     |
| Database  | MongoDB + Mongoose    | 8.x     |
| Dev Tool  | Nodemon               | 3.x     |

---

## 📁 Folder Structure

```
project-root/
├── backend/
│   ├── config/
│   │   └── db.js                  → MongoDB connection
│   ├── controllers/
│   │   └── leadController.js      → All CRUD business logic
│   ├── models/
│   │   └── Lead.js                → Mongoose Lead schema
│   ├── routes/
│   │   └── leadRoutes.js          → Express Router
│   ├── middleware/
│   │   └── errorHandler.js        → Global error handler
│   ├── .env                       → Secrets (never committed)
│   ├── .env.example               → Template (committed)
│   └── server.js                  → Express entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── leadApi.js         → All Axios API functions
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── LeadTable.jsx      → Desktop view
│   │   │   ├── LeadCard.jsx       → Mobile view
│   │   │   ├── LeadForm.jsx       → Create/Edit form
│   │   │   ├── SearchBar.jsx      → Debounced search
│   │   │   ├── FilterDropdown.jsx → Status filter
│   │   │   ├── StatusBadge.jsx    → Colored pill badge
│   │   │   ├── StatsCard.jsx      → Metric card
│   │   │   ├── Pagination.jsx     → Page navigation
│   │   │   ├── ConfirmModal.jsx   → Delete confirm
│   │   │   └── Loader.jsx         → Loading spinner
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      → Main view
│   │   │   ├── AddLead.jsx        → Create page
│   │   │   ├── EditLead.jsx       → Edit page
│   │   │   └── NotFound.jsx       → 404 page
│   │   ├── context/
│   │   │   └── LeadContext.jsx    → Global state
│   │   ├── styles/
│   │   │   └── global.css         → Design tokens + base styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                       → Secrets (never committed)
│   └── .env.example               → Template (committed)
│
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) — v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) — Community Edition (local) or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string
- [Git](https://git-scm.com/)

---

## 🚀 Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/JayThakare05/CRM.git
cd CRM
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Edit `backend/.env` with your values:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/leadcrm
```

Start the backend:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Edit `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api`

| Method | Endpoint        | Description                                |
|--------|-----------------|---------------------------------------------|
| GET    | `/leads`        | Get all leads (with search/filter/sort/page) |
| POST   | `/leads`        | Create a new lead                           |
| GET    | `/leads/:id`    | Get a single lead by ID                     |
| PUT    | `/leads/:id`    | Update a lead                               |
| DELETE | `/leads/:id`    | Delete a lead                               |

### GET /api/leads — Query Parameters

| Parameter | Type   | Default     | Description                              |
|-----------|--------|-------------|------------------------------------------|
| search    | string | `""`        | Regex search on name, email, company     |
| status    | string | `""`        | Filter by exact status value             |
| sortBy    | string | `createdAt` | Field to sort by                         |
| order     | string | `desc`      | Sort direction: `asc` or `desc`          |
| page      | number | `1`         | Page number                              |
| limit     | number | `10`        | Results per page                         |

**Response:**
```json
{
  "success": true,
  "leads": [...],
  "totalLeads": 42,
  "totalPages": 5,
  "currentPage": 1
}
```

### POST /api/leads — Request Body

```json
{
  "name": "Jane Smith",
  "email": "jane@acme.com",
  "phone": "9876543210",
  "company": "Acme Corp",
  "status": "New",
  "notes": "Met at the conference"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "lead": {
    "_id": "...",
    "name": "Jane Smith",
    "email": "jane@acme.com",
    ...
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "A lead with this email already exists"
}
```

---

