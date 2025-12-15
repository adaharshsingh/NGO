# NGO Reports Management System - Backend

A robust Node.js backend for managing NGO monthly reports with features including individual report submission, bulk CSV uploads, advanced search and filtering, and real-time job tracking.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Architecture](#architecture)

---

## Features

### 1. **Individual Report Submission**
   - Submit NGO monthly reports with people helped, events conducted, and funds utilized
   - Real-time data submission via REST API
   - Automatic data deduplication using MongoDB upsert operations

### 2. **Bulk CSV Upload**
   - Upload multiple reports at once via CSV file
   - Automatic CSV parsing and validation
   - Asynchronous job processing with BullMQ and Redis
   - Real-time job status tracking

### 3. **Admin Dashboard**
   - View all reports for a specific month
   - Search NGO reports by ID (case-insensitive regex search)
   - Advanced sorting by any field (NGO ID, people helped, events conducted, funds utilized)
   - Pagination with customizable page size
   - Monthly statistics (total NGOs, people helped, events, funds)

### 4. **Admin Authentication**
   - Secure JWT-based authentication
   - Role-based access control (admin/user)
   - Token-based authorization for protected endpoints

### 5. **Job Tracking**
   - Real-time progress tracking for bulk uploads
   - Detailed error reporting with row numbers
   - Job status states: pending, processing, completed, failed

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Cache/Queue**: Redis (BullMQ for job queues)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **CSV Parsing**: csv-parser
- **File Upload**: multer
- **Development**: nodemon

---

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Redis

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the backend root directory with the required environment variables (see below)

---

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ngo-reports
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here
RUN_WORKER=true
```

### Variables Explanation
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `REDIS_URL`: Redis connection URL
- `JWT_SECRET`: Secret key for JWT token signing
- `RUN_WORKER`: Enable/disable CSV worker process (set to "true" for background jobs)

---

## Running the Server

### Development Mode
```bash
npm run dev
```
Uses nodemon for auto-restart on file changes.

### Production Mode
```bash
node src/server.js
```

### Run Seed Script (Optional)
To populate the database with sample data:
```bash
node report.js
```

### Create Admin User
```bash
node src/new.js
```
Creates a default admin user with:
- Email: `test@example.com`
- Password: `123456`

---

## API Endpoints

### Authentication Routes (`/auth`)

#### 1. **Admin Login**
- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Description**: Authenticate admin user and receive JWT token
- **Request Body**:
  ```json
  {
    "email": "test@example.com",
    "password": "123456"
  }
  ```
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Status Codes**:
  - `200`: Login successful
  - `401`: Invalid credentials

---

### Report Routes (`/report`)

#### 2. **Submit Individual Report**
- **Method**: `POST`
- **Endpoint**: `/report`
- **Description**: Submit a single NGO monthly report
- **Request Body**:
  ```json
  {
    "ngoId": "NGO-001",
    "month": "2025-01",
    "peopleHelped": 150,
    "eventsConducted": 5,
    "fundsUtilized": 50000
  }
  ```
- **Response**:
  ```json
  {
    "message": "Report submitted successfully"
  }
  ```
- **Status Codes**:
  - `200`: Report submitted
  - `400`: Missing required fields (ngoId, month)

---

### Bulk Upload Routes (`/reports`)

#### 3. **Upload CSV File**
- **Method**: `POST`
- **Endpoint**: `/reports/upload`
- **Description**: Upload a CSV file with multiple reports for async processing
- **Request Type**: `multipart/form-data`
- **Form Field**: `file` (CSV file)
- **CSV Format** (required columns):
  ```
  ngoId,month,peopleHelped,eventsConducted,fundsUtilized
  NGO-001,2025-01,150,5,50000
  NGO-002,2025-01,200,8,75000
  ```
- **Response**:
  ```json
  {
    "jobId": "507f1f77bcf86cd799439011",
    "message": "CSV upload started"
  }
  ```
- **Status Codes**:
  - `200`: Upload started
  - `400`: CSV file required
  - `500`: CSV processing failed

---

### Job Status Routes (`/job-status`)

#### 4. **Get Job Status**
- **Method**: `GET`
- **Endpoint**: `/job-status/:jobId`
- **Description**: Track the progress of a bulk CSV upload job (no auth required)
- **Parameters**:
  - `jobId` (path parameter): The job ID from upload response
- **Response**:
  ```json
  {
    "status": "processing",
    "processedRows": 15,
    "failedRows": 2,
    "totalRows": 20,
    "errors": [
      {
        "rowNumber": 5,
        "reason": "ngoId or month missing"
      },
      {
        "rowNumber": 10,
        "reason": "Invalid month format"
      }
    ]
  }
  ```
- **Status Values**:
  - `pending`: Job queued, waiting to process
  - `processing`: Currently processing rows
  - `completed`: Job finished successfully
  - `failed`: Job encountered an error
- **Status Codes**:
  - `200`: Job found
  - `404`: Job not found
  - `500`: Server error

---

### Dashboard Routes (`/dashboard`)

#### 5. **Get Dashboard Data**
- **Method**: `GET`
- **Endpoint**: `/dashboard`
- **Description**: Retrieve paginated reports with search, sorting, and monthly statistics (admin only)
- **Authentication**: Required (Bearer token in Authorization header)
- **Query Parameters**:
  - `month` (required): Month in YYYY-MM format
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Records per page (default: 10)
  - `search` (optional): Search NGO ID (case-insensitive)
  - `sortBy` (optional): Field to sort by (ngoId, peopleHelped, eventsConducted, fundsUtilized)
  - `order` (optional): Sort order - "asc" or "desc" (default: asc)

- **Example Request**:
  ```
  GET /dashboard?month=2025-01&page=1&limit=10&search=NGO-001&sortBy=peopleHelped&order=desc
  Authorization: Bearer <jwt-token>
  ```

- **Response**:
  ```json
  {
    "totals": {
      "totalNGOs": 18,
      "totalPeopleHelped": 2500,
      "totalEvents": 85,
      "totalFunds": 1250000
    },
    "rows": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "ngoId": "NGO-001",
        "month": "2025-01",
        "peopleHelped": 150,
        "eventsConducted": 5,
        "fundsUtilized": 50000,
        "createdAt": "2025-01-15T10:30:00Z",
        "updatedAt": "2025-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalCount": 18,
      "totalPages": 2
    }
  }
  ```
- **Status Codes**:
  - `200`: Data retrieved successfully
  - `400`: Month parameter missing
  - `401`: No token provided
  - `403`: Forbidden (non-admin user)

---

## Database Models

### User Schema
```javascript
{
  email: String (unique),
  password: String (hashed),
  role: String (default: "admin")
}
```

### Report Schema
```javascript
{
  ngoId: String (required),
  month: String (required, format: YYYY-MM),
  peopleHelped: Number (required),
  eventsConducted: Number (required),
  fundsUtilized: Number (required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```
**Indexes**: 
- `{ ngoId: 1, month: 1 }` (unique, ensures idempotency)
- `{ month: 1 }` (for fast filtering)

### Job Schema
```javascript
{
  status: String (enum: ["pending", "processing", "completed", "failed"]),
  totalRows: Number,
  processedRows: Number (default: 0),
  failedRows: Number (default: 0),
  errors: Array [
    {
      rowNumber: Number,
      reason: String
    }
  ],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## Architecture

### Flow Diagrams

#### Individual Report Submission
```
User -> POST /report -> Report Route Handler -> MongoDB -> Response
```

#### Bulk CSV Upload (Async Processing)
```
User -> POST /reports/upload -> Create Job -> Queue Job -> Response
                                              ↓
                                      CSV Worker Process
                                              ↓
                                      Parse & Validate
                                              ↓
                                      Upsert to MongoDB
                                              ↓
                                      Update Job Status
```

#### Dashboard Access
```
Admin -> GET /dashboard (with token) -> Auth Middleware -> Dashboard Route Handler
                                                               ↓
                                                    Apply Filters & Search
                                                               ↓
                                                    Apply Sorting & Pagination
                                                               ↓
                                                    Calculate Aggregates
                                                               ↓
                                                          Response
```

### Middleware
- **adminAuth.js**: JWT verification and role-based access control
  - Verifies token in Authorization header
  - Checks user role is "admin"
  - Attaches user to request object

### Workers
- **csvWorkers.js**: Background job processor for bulk CSV uploads
  - Processes jobs from BullMQ queue
  - Validates and transforms CSV data
  - Inserts/updates reports in MongoDB
  - Handles errors and updates job status

### Queue System
- **BullMQ** with **Redis**: Handles asynchronous job processing
  - Reliable job persistence
  - Automatic retry logic
  - Real-time status tracking

---

## Error Handling

### Common HTTP Status Codes
- `200`: Success
- `400`: Bad request (missing/invalid parameters)
- `401`: Unauthorized (no token or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not found (resource doesn't exist)
- `500`: Server error

### Validation Rules
- **NGO ID**: Required, string
- **Month**: Required, format YYYY-MM
- **Numbers**: peopleHelped, eventsConducted, fundsUtilized must be valid numbers
- **CSV**: Only .csv files accepted

---

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **CORS Enabled**: Cross-origin requests allowed
- **Role-Based Access**: Admin-only endpoints protected
- **Input Validation**: CSV data validated before insertion
- **Unique Constraints**: Prevents duplicate ngoId+month combinations
- **Idempotent Operations**: CSV uploads using upsert to prevent duplicates

---

## Development Tips

### Seeding Database with Sample Data
```bash
node report.js
```
Inserts 54 sample reports (3 months × 18 NGOs with random values)

### Creating Admin Users
```bash
node src/new.js
```
Creates test admin account

### Testing CSV Upload
Create a CSV file `test.csv`:
```csv
ngoId,month,peopleHelped,eventsConducted,fundsUtilized
NGO-001,2025-01,150,5,50000
NGO-002,2025-01,200,8,75000
```

Upload via:
```bash
curl -X POST http://localhost:5000/reports/upload \
  -F "file=@test.csv"
```

---

## License

ISC