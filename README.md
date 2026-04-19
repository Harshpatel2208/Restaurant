# 🍽️ Culinary Transcendence — Restaurant Web App

A full-stack restaurant web application that delivers an immersive fine-dining experience online. Built with **React**, **Vite**, **Express**, and **PostgreSQL**, the app lets guests explore the menu, book a table through an interactive floor-plan wizard, and gives staff full control through a protected admin dashboard.

---

## ✨ Features

### Guest Experience
- **Hero Landing Page** — A cinematic landing section with the restaurant tagline, location badge, and a direct call-to-action to reserve a table.
- **Menu Grid** — Animated menu cards powered by Framer Motion, filterable by cuisine category: Punjabi, Rajasthani, South Indian, and Chinese. Each category has its own distinct visual treatment (e.g., mandala motifs for Rajasthani, a leaf icon for South Indian).
- **Reservation Wizard** — A 4-step guided booking flow:
  1. **Guest count selection** — choose from 1 to 8+ guests.
  2. **Curated seating** — an interactive, visual floor-plan highlights the recommended zone and lets guests tap a specific table to reserve it.
  3. **Time slot selection** — choose an evening arrival time (90-minute dining blocks).
  4. **Confirmation** — enter a booking name and pay a ₹100 deposit to secure the table.

### Admin Dashboard
- **Secure login** — password-protected admin panel.
- **Menu management** — add, edit, and delete dishes with category, name, price, and description.
- **Reservation management** — view all active bookings and release tables when guests leave.
- **Live floor-map status** — a real-time visual floor plan that highlights occupied vs. available tables.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router, Framer Motion, Lucide React |
| Build tool | Vite |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL (via `pg`) |
| Dev tooling | ESLint, concurrently |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL running locally

### 1. Clone and install dependencies
```bash
git clone https://github.com/Harshpatel2208/Restaurant.git
cd Restaurant
npm install
```

### 2. Configure environment variables
Create a `.env` file in the project root:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=restaurant
DB_PASSWORD=your_password
DB_PORT=5432
PORT=5000
```

### 3. Set up the database
Run the provided SQL script against your PostgreSQL instance:
```bash
psql -U postgres -f database.sql
```
The server will also auto-create tables and seed the menu on first startup.

### 4. Start the app
```bash
npm run dev
```
This starts both the Vite dev server (frontend) and the Express API server concurrently.

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:5000 |

---

## 📁 Project Structure

```
Restaurant/
├── src/
│   ├── components/
│   │   ├── Hero.jsx            # Landing section
│   │   ├── MenuGrid.jsx        # Menu with category filter
│   │   ├── Navbar.jsx          # Site navigation
│   │   ├── ReservationWizard.jsx  # 4-step booking flow
│   │   └── AdminDashboard.jsx  # Admin panel
│   ├── App.jsx                 # Route definitions
│   └── main.jsx                # React entry point
├── server/
│   └── index.js                # Express API server
├── menuData.json               # Seed data for the menu
├── database.sql                # Database schema & sample data
└── vite.config.js
```

---

## 🔐 Admin Access

Navigate to `/admin` and log in with:
- **Username:** `admin`
- **Password:** `admin`

> For production use, replace the hardcoded credentials with a secure authentication strategy.

---

## 📜 License

This project is open source. Feel free to fork, adapt, and build on it.

---

## 🌐 Deployment Setup (Important)

The frontend reads API URLs from `VITE_API_BASE_URL`.

- Local development: keep it unset and Vite proxy handles `/api`.
- Production (Vercel/Netlify): set `VITE_API_BASE_URL` to your deployed backend base URL.

Example:

```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

If this value is missing in production and your API is not hosted on the same domain under `/api`, reservation and admin API calls will fail.
