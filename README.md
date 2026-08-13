# Doctor Tracker — Backend

The Doctor Tracker backend is a secure RESTful API built with Node.js and Express for managing doctors, patients, authentication, and dashboard analytics. It uses MongoDB with Mongoose for persistent data storage and provides protected admin endpoints, search, filtering, pagination, doctor-patient relationships, and optimized database queries.

## Live API

**Backend:** https://doctor-tracker-backend-7ttt.onrender.com

**Health Check:** https://doctor-tracker-backend-7ttt.onrender.com/api/health

## Frontend

**Live Frontend:** https://doctor-tracke-two.vercel.app

**Frontend Repository:** https://github.com/Shoybit/doctor-tracke

## Backend Repository

https://github.com/Shoybit/doctor-tracker-backend

## Features

### Authentication
- Admin login
- JWT-based authentication
- HTTP cookie-based authentication
- Protected routes
- Role-based authorization
- Current-user authentication check
- Logout

### Doctor Management
- Create, view, search, filter, paginate, update and deactivate doctors
- Prevent duplicate doctor email addresses
- View patients assigned to a doctor
- Add patients under a specific doctor

### Patient Management
- Add patients under a specific doctor
- List all patients
- Search by name, email, or phone
- Filter by condition and registration date
- Pagination
- Get patients by doctor
- Edit and delete patients

### Dashboard
- Total doctors
- Total patients
- Patients per doctor
- Date-based statistics
- Analytics data for frontend charts

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Cookie Parser
- CORS
- Dotenv

## System Architecture

```text
Next.js Frontend
       |
       | REST API / HTTP
       v
Node.js + Express Backend
       |
       | Mongoose
       v
MongoDB Atlas
```

## Project Structure

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## Setup Guide

### 1. Clone

```bash
git clone https://github.com/Shoybit/doctor-tracker-backend.git
cd doctor-tracker-backend
```

### 2. Install

```bash
npm install
```

### 3. Environment variables

Create `.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

Never commit the real `.env` file.

### 4. Run

```bash
npm run dev
```

or:

```bash
npm start
```

API:

```text
http://localhost:5000
```

## Environment Example

`.env.example`:

```env
PORT=5000
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=http://localhost:3000
```

## API Endpoints

### Health

```text
GET /api/health
```

### Authentication

```text
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

### Doctors

```text
POST   /api/doctors
GET    /api/doctors
GET    /api/doctors/:id
PUT    /api/doctors/:id
DELETE /api/doctors/:id
```

### Patients

```text
POST   /api/doctors/:doctorId/patients
GET    /api/patients
GET    /api/doctors/:doctorId/patients
PUT    /api/patients/:id
DELETE /api/patients/:id
```

### Dashboard

```text
GET /api/dashboard/stats
```

## Authentication & Authorization

Protected endpoints use authentication middleware to verify the logged-in user. Admin-only operations use role-based authorization.

Authentication is handled through secure HTTP cookies.

## Database Optimization

The backend uses MongoDB indexes for frequently queried fields and relationships. Patient queries include indexes for doctor, condition, name, email, phone, registration date, and doctor + registration date.

Pagination uses:

```text
countDocuments()
skip()
limit()
```

to avoid returning unnecessary records.

## Technical Decisions

### 1. Separate Express REST API

Express handles API routes, authentication, validation, business logic, and database communication separately from the Next.js frontend. This keeps responsibilities clear and allows the API to be reused by other clients.

### 2. MongoDB + Mongoose

MongoDB provides flexible document storage while Mongoose provides schemas, validation, relationships through ObjectIds, and efficient query APIs. Indexing and pagination improve performance as the dataset grows.

## Error Handling

The API returns structured JSON responses.

```json
{
  "success": false,
  "message": "Doctor not found"
}
```

Common status codes:

```text
200 Success
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Server Error
```

## CORS

The production API allows the deployed Next.js frontend to communicate using credentialed requests.

Local:

```text
http://localhost:3000
```

Production:

```text
https://doctor-tracke-two.vercel.app
```

## Deployment

The backend is deployed as a Node.js Web Service on Render.

```text
GitHub
   ↓
Render
   ↓
Node.js + Express
   ↓
MongoDB Atlas
```

Production API:

https://doctor-tracker-backend-7ttt.onrender.com

## Security

- Real environment variables are not stored in the repository.
- JWT secret is stored through environment variables.
- Protected endpoints require authentication.
- Admin-only endpoints use role authorization.
- CORS is restricted to approved frontend origins.
- Input validation and error handling are implemented.

## Related Project

### Frontend

Live: https://doctor-tracke-two.vercel.app

Repository: https://github.com/Shoybit/doctor-tracke

## License

This project was developed as part of a technical project assignment.
