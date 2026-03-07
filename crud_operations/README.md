# Lost & Found Management System (React + Node.js)

A web application built with **React** (frontend) and **Node.js + Express** (REST API backend) with **MySQL** database. Manages lost and found items and claims with full CRUD operations.

---

## Project Structure

```
crud_operations/
├── server/                    # Express REST API (port 5000)
│   ├── app.js                 # Entry point
│   ├── config/db.js           # MySQL connection pool
│   ├── models/                # Item.js, Claim.js (CRUD + transaction)
│   ├── controllers/           # JSON response handlers
│   ├── routes/                # RESTful API routes
│   └── middlewares/           # AppError, validate, errorHandler
│
├── client/                    # React app via Vite (port 5173)
│   └── src/
│       ├── App.jsx            # Router + Navbar
│       ├── App.css            # Black-and-white CSS theme
│       ├── pages/             # ItemsList, ItemDetail, AddItem, EditItem,
│       │                        ClaimsList, AddClaim, EditClaim
│       └── components/        # ErrorAlert
│
└── database/schema.sql        # SQL schema
```

---

## Database Schema

### Items Table

| Column         | Type                            | Constraints                |
|----------------|---------------------------------|----------------------------|
| id             | INT AUTO_INCREMENT              | PRIMARY KEY                |
| name           | VARCHAR(255)                    | NOT NULL                   |
| description    | TEXT                            |                            |
| location_found | VARCHAR(255)                    |                            |
| date_found     | DATE                            |                            |
| status         | ENUM('lost','found','resolved') | NOT NULL, DEFAULT 'found'  |
| created_at     | TIMESTAMP                       | DEFAULT CURRENT_TIMESTAMP  |

### Claims Table

| Column         | Type                                  | Constraints                                  |
|----------------|---------------------------------------|----------------------------------------------|
| id             | INT AUTO_INCREMENT                    | PRIMARY KEY                                  |
| item_id        | INT                                   | NOT NULL, FK → items(id) ON DELETE CASCADE   |
| claimant_name  | VARCHAR(255)                          | NOT NULL                                     |
| contact_info   | VARCHAR(255)                          |                                              |
| claim_status   | ENUM('pending','approved','rejected') | NOT NULL, DEFAULT 'pending'                  |
| created_at     | TIMESTAMP                             | DEFAULT CURRENT_TIMESTAMP                    |

---

## How to Run

### Prerequisites
- Node.js (v14+)
- MySQL server running

### 1. Set Up the Database

```sql
source database/schema.sql;
```

### 2. Configure Server Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lost_and_found
PORT=5000
```

### 3. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Start Both Servers

**Terminal 1** — Backend:
```bash
cd server
npm start
```

**Terminal 2** — Frontend:
```bash
cd client
npm run dev
```

### 5. Open in Browser

Go to **http://localhost:5173**

---

## API Endpoints

| Method | URL                      | Description                  |
|--------|--------------------------|------------------------------|
| GET    | /api/items               | List all items               |
| GET    | /api/items/:id           | Get item detail + its claims |
| POST   | /api/items               | Create a new item            |
| PUT    | /api/items/:id           | Update an item               |
| DELETE | /api/items/:id           | Delete an item               |
| GET    | /api/claims              | List all claims (JOIN)       |
| GET    | /api/claims/:id          | Get single claim             |
| POST   | /api/claims              | Create a new claim           |
| PUT    | /api/claims/:id          | Update a claim               |
| DELETE | /api/claims/:id          | Delete a claim               |
| POST   | /api/claims/:id/approve  | Approve claim (transaction)  |

## Error Handling

- **AppError** — Custom error class with statusCode, message, details
- **validate.js** — Server-side validation middleware (name required, length limits)
- **errorHandler.js** — Centralized error handler returning JSON errors
- **ErrorAlert.jsx** — React component displaying error banners with field-level details
