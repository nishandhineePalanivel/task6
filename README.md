# Cognifyz Web Development Internship — Level 3, Task 6
## Database Integration & Server User Authentication

### Project Overview
This project completes Level 3 Task 6 of the Cognifyz Web Development Internship by integrating persistent database storage (`services/db.js`), server-side user authentication (`POST /api/auth/register`, `POST /api/auth/login`), bcrypt password encryption, JWT authorization token generation, and securing REST API CRUD endpoints with authorization middleware.

---

### Key Technical Implementations

1. **Database Integration**:
   - Persistent database storage module (`services/db.js`) maintaining User accounts and Registration schemas.
   - User Schema: `{ id, name, email, password (bcrypt hashed), role, createdAt }`.
   - Registration Schema: `{ id, userId, name, email, phone, age, course, createdAt, updatedAt }`.

2. **Server User Authentication**:
   - `POST /api/auth/register`: Validates credentials, hashes passwords using `bcryptjs`, creates account, and returns signed JWT token.
   - `POST /api/auth/login`: Verifies user credentials against bcrypt hashed password (`bcrypt.compareSync`), generating a signed JWT authorization token (`jsonwebtoken`).
   - `GET /api/auth/me`: Protected route returning active user details.

3. **API Endpoint Authorization**:
   - Middleware `authenticateToken` validates incoming `Authorization: Bearer <token>` headers.
   - Unauthenticated API requests receive HTTP `401 Unauthorized`.
   - Protected Endpoints:
     - `POST /api/registrations`: Requires JWT Token header.
     - `PUT /api/registrations/:id`: Requires JWT Token header.
     - `DELETE /api/registrations/:id`: Requires JWT Token header.

4. **Task 4 & Task 5 Features Preserved**:
   - Real-time form validation (Name, Email, 10-digit Phone, Age, Course, Password rules, Terms).
   - Dynamic Password Strength Progress Bar & Badge (Weak, Medium, Strong).
   - Password Requirement Checklist with live checkmarks.
   - Show/Hide password toggle buttons & Name character counter (`X / 50`).
   - Live Application Preview panel.
   - Responsive CRUD Management Dashboard with dynamic search filter, Edit/Delete modals, and table rendering.
   - SPA Hash Routing (`#home`, `#register`, `#dashboard`, `#login`, `#user-register`, `#success`, `#contact`, and 404 page).

---

### REST API Documentation

#### Auth Endpoints
- `POST /api/auth/register` — Register user account (Returns JWT Token & User Profile).
- `POST /api/auth/login` — Authenticate credentials (Returns JWT Token & User Profile).
- `GET /api/auth/me` — Retrieve active user session details (Requires `Bearer <token>`).

#### Protected Registration CRUD Endpoints
- `GET /api/registrations` — Fetch all registration records (`200 OK`).
- `GET /api/registrations/:id` — Fetch single record by ID (`200 OK` / `404 Not Found`).
- `POST /api/registrations` — Create new record (Requires `Authorization: Bearer <token>`, Returns `201 Created`).
- `PUT /api/registrations/:id` — Update record (Requires `Authorization: Bearer <token>`, Returns `200 OK`).
- `DELETE /api/registrations/:id` — Delete record (Requires `Authorization: Bearer <token>`, Returns `200 OK`).

---

### Demo Account Credentials

| Account Role | Email Address | Plaintext Password |
|---|---|---|
| **Administrator** | `admin@college.edu` | `Admin@12345` |
| **Standard User** | `user@college.edu` | `User@12345` |

---

### How to Run the Project

1. Set your working directory to:
   ```
   C:\Users\NISHANDHINEE\.gemini\antigravity\scratch\task6-db-authentication
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   node server.js
   ```
4. Access in browser:
   - **User Login**: [http://localhost:3000/#login](http://localhost:3000/#login)
   - **Account Sign Up**: [http://localhost:3000/#user-register](http://localhost:3000/#user-register)
   - **Student Application**: [http://localhost:3000/#register](http://localhost:3000/#register)
   - **CRUD Management Dashboard**: [http://localhost:3000/#dashboard](http://localhost:3000/#dashboard)
