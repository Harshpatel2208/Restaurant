# Table Reservation System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a premium, multi-step table reservation wizard for AURA featuring an interactive Seating Mini-Map, intelligent table-size routing, 90-minute auto-release slot booking logic, and seamless Framer Motion transitions.

**Architecture:** 
- **Frontend:** A React component `ReservationWizard` managing a multi-step state using `@react-patterns`. Includes a new structural sub-component `SeatingMiniMap` to visualize seating zones. State transitions handled via Framer Motion.
- **Backend:** Express API with PostgreSQL to query table availability based on overlapping `start_time` and `end_time`.
- **Database:** A `reservations` table utilizing `@database-design` capturing timestamps, table assignment, and guest counting natively.

**Tech Stack:** React, Framer Motion, Node.js/Express, PostgreSQL.

---

## Scope
- **In:** Multi-step Flow (Guest Count -> Table Suggestion w/ Seating Mini-Map -> Time Selection w/ 90m block -> Payment summary at ₹100), PostgreSQL schema generation, and an Express endpoint for availability checks.
- **Out:** Actual payment processing (will mock the deposit success).

---

### Task 1: PostgreSQL Database Schema (`@database-design`)

**Files:**
- Create: `server/init_db.sql`

**Step 1: Write SQL Schema**
```sql
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    guest_name VARCHAR(255),
    guest_phone VARCHAR(20),
    guest_count INT NOT NULL,
    table_id VARCHAR(10) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    deposit_amount NUMERIC(10, 2) DEFAULT 100.00,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_time_logic CHECK (end_time > start_time)
);

CREATE INDEX idx_reservations_time_table ON reservations (table_id, start_time, end_time);
```

**Step 2: Commit**
```bash
git add server/init_db.sql
git commit -m "feat: design schema for reservations table with 90min slot foundation"
```

---

### Task 2: Backend API for Availability & Booking

**Files:**
- Modify: `server/index.js`

**Step 1: Write backend implementation**
- **GET `/api/availability`**: Accepts `date` and `table_id`. Checks overlapping boundaries.
- **POST `/api/reserve`**: Accepts booking payload, validates 90-minute strict auto-release block logic, creates reservation.

**Step 2: Commit**
```bash
git commit -am "feat: add reservation endpoints"
```

---

### Task 3: Scaffold the React Multi-Step Wizard State

**Files:**
- Create: `src/components/ReservationWizard.jsx`
- Create: `src/components/ReservationWizard.css`

**Step 1: Implement Component Framework**
Use `useState` for stepping:
- `<Step1Guests />`: Dropdown (1-8+) for guest count.
- `<Step2Table />`: Suggests dynamic table zones & displays the Mini-Map.
- `<Step3Time />`: Allows user to pick a time, auto-blocking 90 minutes.
- `<Step4Payment />`: Summary + ₹100 Deposit Confirmation button.

**Step 2: Apply Frontend Design Aesthetic**
Use `var(--color-base)` and `var(--color-accent)`.

**Step 3: Commit**
```bash
git add src/components/ReservationWizard.jsx src/components/ReservationWizard.css
git commit -m "feat: scaffold multi-step reservation state"
```

---

### Task 4: Build Seating Mini-Map logic

**Files:**
- Create: `src/components/SeatingMiniMap.jsx`
- Create: `src/components/SeatingMiniMap.css`

**Step 1: Implementation**
Interactive SVG/div-based map highlighting specific zones in gold based on the `guestCount` prop:
- 1-2 people → T201-T208 (Center-Left)
- 3-4 people → T401-T416 (Left/Center-Right)
- 5-6 people → T601-T608 (Right Column)
- 7-8+ people → T801-T804 (Bottom Family Row)

**Step 2: Commit**
```bash
git add src/components/SeatingMiniMap.jsx src/components/SeatingMiniMap.css
git commit -m "feat: build seating mini map displaying gold highlighted zones"
```
