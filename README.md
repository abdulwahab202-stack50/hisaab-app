# Hisab App - Money Tracker & Client Management System 💼

A full-stack modern financial bookkeeping and client management platform built with the **MERN Stack** (MongoDB, Express, React, Node.js). Designed for precision, bank-grade isolation, automated timestamps, date filtering, and granular administrative licensing.

---

## 🚀 Key Highlights & Features

### 1. Visual Cash Flow Analytics
- **Top Summary Cards**:
  - 🟢 **Total Incoming**: Green theme, tracks all payments and earnings.
  - 🔴 **Total Outgoing**: Red theme, tracks all expenses and overheads.
  - 🔵 **Total Net Balance**: Blue theme, computed dynamically (`Total Incoming - Total Outgoing`).
- **Real-Time Calculation**: Top balance and metrics auto-update whenever transactions are added or deleted.

### 2. Timeframe Date Filtering
- **Today**: Filter records created during the current day.
- **This Week (Last 7 Days)**: Rolling 7-day financial snapshot.
- **Last Week**: 7 to 14 days ago for previous cycle comparison.
- **This Month**: All transactions from the 1st of the current month.
- **All Time**: Complete transaction archive.

### 3. Automated Date & Time Recording
- When creating Incoming or Outgoing records, the backend automatically stamps the exact **Date & Time** via server clocks. No manual picker required.

### 4. Client Access & Expiry System
- **Strict Tenant Isolation**: Clients only ever see and delete their own transactions.
- **Access Expiry Enforcement**:
  - If a client's account is deactivated (`isActive: false`) **OR** their license expiry date has passed (`expiryDate < today`), the login API blocks authentication with:
    > `"Your access expired, contact admin"`
- **Client Deployment Model**:
  - Clients only receive the **deployed Web App Link + Login Credentials**. They never receive source code.

### 5. Central Admin Management Console
- View all registered clients with their transaction count, balance, and account status.
- **Create New Client**: Provision client access with 7-Day Free Trial or 30-Day License.
- **One-Click Actions**:
  - **Activate / Deactivate**: Instantly toggle client access.
  - **Extend Expiry**: Extend license by `+7 Days` or `+30 Days`.
  - **Delete Client**: Removes client and wipes associated data.
  - **Instant Invite Generator**: Copy formatted client invite message with login link and password.

---

## 📁 Project Architecture & File Structure

```
money_tracker/
├── package.json                   # Root orchestrator with concurrently scripts
├── README.md                      # Comprehensive project documentation
├── server/
│   ├── .env                       # Environment variables (Mongo URI, JWT Secret, Port)
│   ├── .env.example               # Example template
│   ├── package.json               # Backend dependencies
│   ├── server.js                  # Express application entry & auto admin seeder
│   ├── seed.js                    # Database seed script for test accounts & sample data
│   ├── config/
│   │   └── db.js                  # Mongoose connection logic
│   ├── models/
│   │   ├── User.js                # User model (name, email, password, role, isActive, expiryDate)
│   │   └── Transaction.js         # Transaction model (userId, type, amount, source, note, date)
│   ├── middleware/
│   │   └── auth.js                # JWT verification & admin guard with expiry enforcement
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Me handlers
│   │   ├── transactionController.js # CRUD, date filters & summary aggregator
│   │   └── adminController.js     # Client list, creation, toggle, expiry extension
│   └── routes/
│       ├── authRoutes.js          # /api/auth/*
│       ├── transactionRoutes.js   # /api/transactions/*
│       └── adminRoutes.js         # /api/admin/*
└── client/
    ├── package.json               # Frontend dependencies (React, Vite, Tailwind, etc.)
    ├── vite.config.js             # Vite configuration with API proxy
    ├── tailwind.config.js         # Tailwind styling config
    ├── postcss.config.js
    ├── index.html                 # App shell with Plus Jakarta Sans typography
    └── src/
        ├── main.jsx               # React entry point
        ├── App.jsx                # Router configuration & route guards
        ├── index.css              # Global Tailwind directives & custom scrollbars
        ├── api/
        │   └── axios.js           # Axios instance with JWT interceptor & 401 handling
        ├── context/
        │   └── AuthContext.jsx    # User authentication provider & state
        ├── components/
        │   ├── Navbar.jsx         # Header with branding, role pill, days left, & navigation
        │   ├── ProtectedRoute.jsx # Client route security guard
        │   ├── AdminRoute.jsx     # Admin route security guard
        │   ├── StatCard.jsx       # Green, Red, and Blue metric cards
        │   ├── FilterBar.jsx      # Date timeframe selector
        │   ├── TransactionFormModal.jsx # Add Incoming & Add Outgoing forms
        │   └── TransactionList.jsx# Lists for incoming/outgoing with date, time & delete
        └── pages/
            ├── LandingPage.jsx    # Public showcase (Features, Pricing, CTAs - No money data)
            ├── LoginPage.jsx      # Login page with demo fillers & expiry alert
            ├── SignupPage.jsx     # 30-day trial registration
            ├── DashboardPage.jsx  # Client money tracker & balance dashboard
            └── AdminDashboardPage.jsx # Admin client management & license control
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide React
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT), bcryptjs
- **Tooling**: Concurrently, Nodemon

---

## ⚡ Quick Start & Run Steps

### 1. Configure Backend Environment
Open `server/.env` and update the database connection string:
```env
MONGO_URI=your_mongodb_atlas_url_here
JWT_SECRET=hisab_secret_123
PORT=5000
```
*(If running MongoDB locally, use `mongodb://127.0.0.1:27017/hisab_app`)*

### 2. Install All Dependencies
From the root directory:
```bash
# Install root, backend, and frontend dependencies
npm run install-all
```
*Or install separately:*
```bash
cd server && npm install
cd ../client && npm install
```

### 3. (Optional) Seed Sample Test Accounts
To populate an Admin, an Active Client with sample transactions, and an Expired Client:
```bash
npm run seed --prefix server
```

### 4. Run Development Servers
From the root directory:
```bash
npm run dev
```
This concurrently starts:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

---

## 👥 Pre-Configured Test Accounts

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hisab.com` | `admin123` | Full admin privileges, client management |
| **Active Client** | `client@hisab.com` | `client123` | Active client with 25 days trial and sample transactions |
| **Expired Client** | `expired@hisab.com` | `expired123` | Tests access rejection (`"Your access expired, contact admin"`) |

*(On the Login page, click any of the **Quick Test Accounts** buttons to auto-populate credentials instantly!)*

---

## 📡 Backend API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register client account (default 30-day trial) |
| `POST` | `/api/auth/login` | Public | Verify credentials, checks `isActive` & `expiryDate` |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |

### 💵 Transactions (`/api/transactions`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/transactions` | Private (Client) | Get client's transactions. Supports `?filter=today\|this_week\|last_week\|this_month\|all` |
| `POST` | `/api/transactions` | Private (Client) | Create new incoming/outgoing entry with auto date & time |
| `DELETE` | `/api/transactions/:id` | Private (Client) | Delete client's own transaction record |
| `GET` | `/api/transactions/summary`| Private (Client) | Compute Total Incoming, Total Outgoing, and Net Balance |

### 🛡️ Admin Management (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/clients` | Admin Only | Get list of clients with transaction count and balance |
| `POST` | `/api/admin/create-client` | Admin Only | Create client with 7-day or 30-day expiry |
| `PUT` | `/api/admin/toggle-client/:id`| Admin Only | Toggle active/deactive status |
| `PUT` | `/api/admin/extend-expiry/:id`| Admin Only | Extend client expiry by N days (`+7D`, `+30D`) |
| `DELETE` | `/api/admin/clients/:id` | Admin Only | Delete client and wipe all associated transactions |
