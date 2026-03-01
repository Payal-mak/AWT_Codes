# Lost & Found Management System

A simple web application built with **Node.js**, **Express**, and **MySQL** to manage lost and found items and claims. The frontend uses pure **HTML + CSS** (EJS templates) with a clean black-and-white theme.

---

## Features

- **Items CRUD** — Create, Read, Update, and Delete lost/found items
- **Claims CRUD** — File, view, edit, and delete claims against items
- **Approve Claim (Transaction)** — Approving a claim marks the claim as "approved" and the linked item as "resolved" in a single database transaction
- **JOIN queries** — Claims list displays item names via SQL JOINs
- **Foreign Keys** — Claims reference Items; cascading delete removes claims when an item is deleted

---

## Database Schema

### Items Table

| Column         | Type                                  | Constraints              |
|----------------|---------------------------------------|--------------------------|
| id             | INT AUTO_INCREMENT                    | PRIMARY KEY              |
| name           | VARCHAR(255)                          | NOT NULL                 |
| description    | TEXT                                  |                          |
| location_found | VARCHAR(255)                          |                          |
| date_found     | DATE                                  |                          |
| status         | ENUM('lost','found','resolved')       | NOT NULL, DEFAULT 'found'|
| created_at     | TIMESTAMP                             | DEFAULT CURRENT_TIMESTAMP|

### Claims Table

| Column         | Type                                     | Constraints                          |
|----------------|------------------------------------------|--------------------------------------|
| id             | INT AUTO_INCREMENT                       | PRIMARY KEY                          |
| item_id        | INT                                      | NOT NULL, FOREIGN KEY → items(id) ON DELETE CASCADE |
| claimant_name  | VARCHAR(255)                             | NOT NULL                             |
| contact_info   | VARCHAR(255)                             |                                      |
| claim_status   | ENUM('pending','approved','rejected')    | NOT NULL, DEFAULT 'pending'          |
| created_at     | TIMESTAMP                                | DEFAULT CURRENT_TIMESTAMP            |

---

### Configure Environment

Copy `.env.example` to `.env` and fill in your MySQL credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lost_and_found
PORT=3000
```

### Install Dependencies

```bash
npm install
```

### Start the Application

```bash
npm start
```

The app will be available at **http://localhost:3000**

---

## Routes

| Method | URL                  | Description                  |
|--------|----------------------|------------------------------|
| GET    | /items               | List all items               |
| GET    | /items/add           | Show add item form           |
| POST   | /items/add           | Create a new item            |
| GET    | /items/:id           | View item detail + claims    |
| GET    | /items/edit/:id      | Show edit item form          |
| POST   | /items/edit/:id      | Update an item               |
| POST   | /items/delete/:id    | Delete an item               |
| GET    | /claims              | List all claims (with JOINs) |
| GET    | /claims/add          | Show add claim form          |
| POST   | /claims/add          | Create a new claim           |
| GET    | /claims/edit/:id     | Show edit claim form         |
| POST   | /claims/edit/:id     | Update a claim               |
| POST   | /claims/delete/:id   | Delete a claim               |
| POST   | /claims/approve/:id  | Approve claim (transaction)  |
