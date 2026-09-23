# InsureAI 🚗🛡️

InsureAI is an AI-assisted vehicle insurance claim management platform that helps dealerships submit vehicle damage claims and enables insurers to review, analyze, approve, or reject those claims.

The system combines a **React frontend**, **Spring Boot backend**, **PostgreSQL database**, and a **FastAPI + YOLO computer-vision service** to automate vehicle-damage analysis and generate an estimated repair cost based on detected vehicle parts, damage types, and vehicle information.

---

## ✨ Key Features

### Dealership Portal
- Dealership registration and login
- JWT-based authentication
- Vehicle/claim submission
- Upload multiple vehicle-damage images
- Upload an estimate image
- View previously submitted claims
- View dealership profile

### Insurer Portal
- Insurer registration and login
- JWT-based authentication
- View pending claims
- Open individual claims
- Run AI-based vehicle damage analysis
- View detected damage and estimated part prices
- Approve claims with an approved amount and remarks
- Reject claims with remarks

### AI Damage Analysis
The AI service processes uploaded vehicle images through multiple YOLO models:

1. **Damage classification** – determines whether damage is present.
2. **Damage detection** – identifies damage types such as scratches, dents, cracks, etc.
3. **Part segmentation** – identifies vehicle parts.
4. **Part detection** – provides an additional part-detection model.
5. **Damage-to-part matching** – uses Intersection over Union (IoU) to associate detected damage with the most relevant vehicle part.
6. **Price lookup** – retrieves a part price from a vehicle/part pricing dataset and uses fallback prices when a matching entry is unavailable.

---

## 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │      Dealership      │
                         │   React Web Portal   │
                         └──────────┬──────────┘
                                    │
                                    │ REST API / JWT
                                    ▼
┌──────────────────────────────────────────────────────────────┐
│                    Spring Boot Backend                       │
│                                                              │
│  Authentication │ Claim Management │ File Storage │ Security │
└───────────────┬───────────────────────────────┬──────────────┘
                │                               │
                │ JPA / Hibernate               │ HTTP
                ▼                               ▼
      ┌──────────────────┐           ┌────────────────────────┐
      │    PostgreSQL    │           │   FastAPI AI Service   │
      │                  │           │                        │
      │ Dealerships      │           │ YOLO Damage Models     │
      │ Insurers         │           │ Part Detection         │
      │ Claims           │           │ Part Segmentation      │
      └──────────────────┘           │ Price Estimation      │
                                     └────────────────────────┘
                                                ▲
                                                │
                                      ┌─────────┴─────────┐
                                      │   Vehicle Images  │
                                      └───────────────────┘
```

---

## 🔄 Claim Processing Flow

```text
Dealership
    │
    │ Submit vehicle details + damage images
    ▼
Spring Boot Backend
    │
    │ Store images + claim information
    ▼
PostgreSQL + Local Upload Storage
    │
    │ Insurer opens claim
    ▼
Insurer Dashboard
    │
    │ Request AI Analysis
    ▼
Spring Boot AIAnalysisService
    │
    │ Multipart HTTP request
    ▼
FastAPI AI Service
    │
    ├── Damage classification
    ├── Damage detection
    ├── Part segmentation
    ├── Part detection
    ├── IoU-based damage/part matching
    └── Price lookup
    │
    ▼
AI Analysis Result
    │
    │ Detected part + damage + estimated price
    ▼
Insurer Review
    │
    ├── Approve
    └── Reject
```

---

## 🧰 Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- JavaScript
- CSS

### Backend
- Java 21
- Spring Boot 3.5
- Spring Web
- Spring Data JPA
- Spring Security
- Hibernate
- Maven
- Lombok
- PostgreSQL
- JSON Web Tokens (JWT)

### AI Service
- Python
- FastAPI
- Ultralytics YOLO
- NumPy
- Pandas
- Multipart file processing

### Database
- PostgreSQL

---

## 📁 Project Structure

```text
InsureAI/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   │   ├── dealership/
│   │   │   └── insurer/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   └── backend/
│       ├── src/
│       │   └── main/
│       │       ├── java/com/InsureAI/backend/
│       │       │   ├── config/
│       │       │   ├── controllers/
│       │       │   ├── dto/
│       │       │   ├── models/
│       │       │   ├── repositories/
│       │       │   └── services/
│       │       └── resources/
│       │           └── application.yaml
│       ├── pom.xml
│       └── mvnw
│
└── insure_ai_project/
    ├── scripts/
    │   └── ai_service.py
    └── prac.py
```

---

# 🚀 Getting Started

## Prerequisites

Install the following before running the project:

- Java 21+
- Maven (or use the included Maven Wrapper)
- Node.js 18+
- npm
- Python 3.10+
- PostgreSQL
- Git

For the AI service, install the Python dependencies used by the project:

```bash
pip install fastapi uvicorn ultralytics pandas numpy python-multipart
```

---

# 1. Clone the Repository

```bash
git clone <your-repository-url>
cd InsureAI
```

---

# 2. Configure PostgreSQL

Create a PostgreSQL database:

```sql
CREATE DATABASE claims_db;
```

Configure the Spring Boot database connection in:

```text
backend/backend/src/main/resources/application.yaml
```

Example:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/claims_db
    username: <your-postgres-username>
    password: <your-postgres-password>

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

**Important:** Do not commit real database passwords, JWT secrets, API keys, or other credentials to GitHub. Use environment variables or a local configuration file for development.

---

# 3. Start the Spring Boot Backend

Navigate to:

```bash
cd backend/backend
```

On Windows:

```bash
.\mvnw.cmd spring-boot:run
```

On Linux/macOS:

```bash
./mvnw spring-boot:run
```

The backend runs by default on:

```text
http://localhost:8080
```

---

# 4. Start the AI Service

Navigate to the AI project:

```bash
cd insure_ai_project
```

The AI service uses FastAPI and exposes:

```text
POST /predict
```

Start it with:

```bash
uvicorn scripts.ai_service:app --host 0.0.0.0 --port 9000
```

The AI service runs on:

```text
http://localhost:9000
```

## AI Model Files

The AI service expects trained YOLO model weights at paths similar to:

```text
runs/classify/train/weights/best.pt
runs/detect/train3/weights/best.pt
runs/segment/train2/weights/best.pt
runs/detect/train5/weights/best.pt
```

The pricing dataset is expected at:

```text
parts_prices_standardized.csv
```

These trained model weights and the pricing dataset should be available in the AI service's working directory before starting the service.

---

# 5. Start the React Frontend

Navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

The frontend uses:

```text
http://localhost:8080
```

as the default backend URL.

You can override it using a Vite environment variable:

```env
VITE_API_BASE=http://localhost:8080
```

---

# 🔐 Authentication

InsureAI uses **JWT-based authentication**.

### Login flow

```text
User Login
    │
    ▼
Spring Boot validates credentials
    │
    ▼
JWT generated with:
    - user ID
    - user role
    - issue time
    - expiration time
    │
    ▼
Frontend stores token
    │
    ▼
Axios interceptor adds:
Authorization: Bearer <token>
```

Two primary roles are supported:

```text
DEALERSHIP
INSURER
```

Frontend protected routes use role-based route protection.

---

# 📡 Important API Endpoints

## Dealership

| Method | Endpoint | Description |
|---|---|---|
| POST | `/dealership/signup` | Register dealership |
| POST | `/dealership/login` | Login dealership |
| GET | `/dealership/me` | Get logged-in dealership |
| POST | `/damage/submit` | Submit vehicle damage claim |
| GET | `/damage/my-submissions` | Get dealership's submissions |

### Damage submission

A claim contains:

- Vehicle brand
- Vehicle model
- Vehicle year
- VIN
- Registration number
- Multiple damage images
- Estimate image

The application currently requires at least **3 damage images** for a submission.

---

## Insurer

| Method | Endpoint | Description |
|---|---|---|
| POST | `/insurer/signup` | Register insurer |
| POST | `/insurer/login` | Login insurer |
| GET | `/insurer/me` | Get logged-in insurer |
| GET | `/insurer/claims/pending` | Get pending claims |
| GET | `/insurer/claims/{id}` | Get a specific claim |
| GET | `/insurer/claims/analysis/{claimId}` | Run AI analysis |
| POST | `/insurer/claims/{id}/approve` | Approve claim |
| POST | `/insurer/claims/{id}/reject` | Reject claim |

---

# 🤖 AI Pipeline

The AI service combines multiple YOLO models rather than relying on a single prediction.

### Step 1 — Damage Classification

The first model checks whether the uploaded image contains vehicle damage.

### Step 2 — Damage Detection

The second model detects the type and location of damage.

Example output:

```json
{
  "damage": "dent",
  "bbox": [120, 80, 420, 350]
}
```

### Step 3 — Vehicle Part Detection / Segmentation

Additional YOLO models identify vehicle parts such as:

```text
door
bumper
hood
fender
headlight
```

The implementation supports both segmentation masks and bounding boxes.

### Step 4 — Damage-to-Part Matching

The system calculates **Intersection over Union (IoU)** between the damage bounding box and detected vehicle-part bounding boxes.

Conceptually:

```text
             Damage
        ┌──────────────┐
        │              │
        │      ┌───────┼───────┐
        │      │ Part  │       │
        └──────┼───────┘       │
               │               │
               └───────────────┘
```

The part with the highest overlap is selected when the IoU passes the configured threshold.

### Step 5 — Price Estimation

The detected:

```text
vehicle part
+
damage type
+
vehicle brand
+
vehicle model
```

are used to look up an estimated price from the pricing dataset.

If a matching part is unavailable, the service uses fallback damage-based prices.

### Example

```json
{
  "part": "door",
  "damage": "dent",
  "price": 1000
}
```

---

# 🗄️ Data Model

The main entities are:

### Dealership

```text
Dealership
├── id
├── dealershipName
├── ownerName
├── email
├── password
├── phoneNumber
├── address
├── pincode
├── gstNumber
├── role
└── createdAt
```

### Insurer

```text
Insurer
├── id
├── name
├── email
├── password
├── companyName
└── role
```

### DamageSubmission

```text
DamageSubmission
├── id
├── dealershipId
├── brand
├── model
├── year
├── vin
├── registrationNumber
├── damageImages
├── estimateImageUrl
├── status
├── submittedAt
├── approvedAmount
├── insurerRemarks
└── insurerId
```

Claim status can be:

```text
PENDING
APPROVED
REJECTED
```

---

# 🧩 Backend Design

The Spring Boot backend follows a layered structure:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```

### Controllers

Handle HTTP requests and responses.

### Services

Contain application/business logic.

Important services include:

- `AIAnalysisService`
- `ClaimReviewService`
- `FileStorageService`
- `JwtService`

### Repositories

Spring Data JPA repositories provide database access.

### Models

JPA entities represent application data stored in PostgreSQL.

---

# 🔗 Backend ↔ AI Service Communication

The Spring Boot backend acts as the application layer between the frontend and AI service.

When an insurer requests claim analysis:

```text
React
  │
  │ GET /insurer/claims/analysis/{id}
  ▼
Spring Boot
  │
  │ Reads claim images
  │ Reads vehicle brand/model
  ▼
AIAnalysisService
  │
  │ POST multipart/form-data
  ▼
FastAPI /predict
  │
  │ YOLO inference
  ▼
AI result
  │
  ▼
Spring Boot
  │
  ▼
React Analysis Page
```

This keeps the AI inference service separate from the main business backend.

---

# 📷 File Storage

Uploaded images are stored in the backend's:

```text
uploads/
```

The backend generates filenames using the current timestamp to reduce filename collisions.

The database stores paths such as:

```text
/uploads/<filename>
```

---

# 🛡️ Security

The application includes:

- JWT authentication
- Password hashing using Spring Security password encoders
- Role-based protected frontend routes
- Backend authentication filters
- Authenticated claim operations
- Multipart upload handling

For production deployment, additional security hardening should be applied, including:

- Environment-based secrets
- HTTPS
- Restricted CORS origins
- Cloud/object storage for uploaded images
- Strong JWT secret management
- File type/content validation
- Rate limiting
- Input validation and centralized exception handling

---

# 🧪 Testing

The Spring Boot project contains a test structure under:

```text
backend/backend/src/test/
```

Run backend tests with:

```bash
.\mvnw.cmd test
```

or:

```bash
./mvnw test
```

Frontend linting:

```bash
npm run lint
```

Frontend production build:

```bash
npm run build
```

---

# 🐛 Troubleshooting

### PostgreSQL connection error

Check:

```text
PostgreSQL is running
Database claims_db exists
Username/password are correct
Port 5432 is available
```

### AI service connection error

Make sure FastAPI is running on:

```text
http://localhost:9000
```

and that the YOLO model files exist at the paths expected by `ai_service.py`.

### Frontend cannot connect to backend

Check:

```text
VITE_API_BASE
```

and make sure Spring Boot is running on port `8080`.

### AI model cannot be loaded

Verify that the `.pt` files exist and that the paths in:

```text
insure_ai_project/scripts/ai_service.py
```

are correct relative to the directory from which Uvicorn is started.

---

# 📌 Current Project Scope

InsureAI is designed as an **AI-assisted claim assessment system**. The AI output provides damage/part detection and estimated part pricing to support the insurer's review process.

The final claim decision remains with the insurer through the claim approval/rejection workflow.

---

# 🔮 Future Improvements

Potential extensions include:

- Cloud storage using S3/Cloudinary
- Asynchronous AI inference using a message queue
- Redis caching
- Automatic claim-cost aggregation
- Better repair-cost estimation
- Fraud/anomaly detection
- Claim history and analytics
- Notification system
- Docker-based deployment
- CI/CD pipeline
- Automated model versioning
- Model confidence scores in the UI
- Database normalization for claim images and detected damages
- Production monitoring and logging

---

## 👨‍💻 Project

**InsureAI — AI-Assisted Vehicle Insurance Claim Management System**

Built with:

```text
React + Spring Boot + PostgreSQL + FastAPI + YOLO
```

