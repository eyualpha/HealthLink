# HealthLink – Electronic Health Record (EHR) System

HealthLink is a centralized, secure, and scalable Electronic Health Record (EHR) system designed to modernize healthcare delivery in Ethiopia. The platform connects patients, doctors, and healthcare administrators through a unified digital system, reducing waiting times, minimizing medical errors, and improving continuity of care.

---

##  Project Overview

The Ethiopian healthcare system faces challenges such as fragmented patient records, long waiting times, and limited access to medical history across facilities.  
**HealthLink** addresses these issues by providing:

- Centralized patient medical records (EHR)
- Role-based access control (RBAC)
- Appointment scheduling and management
- Digital prescriptions with AI-powered safety checks
- Secure audit logging for compliance and accountability

---

##  System Architecture

HealthLink follows a **modular service-based architecture**:

- **Frontend:** React.js / Flutter  
- **Backend:** Node.js (Express)  
- **Database:** MongoDB (Mongoose ODM)  
- **AI Module:** Python (FastAPI, rule-based engine)  
- **Security:** JWT, bcrypt, TLS/SSL  
- **DevOps:** Docker, GitHub CI/CD  

---

## 🗄️ Database Design (Database Architecture)

The database layer is designed for **performance, scalability, and data integrity**, following healthcare best practices.

### Core Models
src/models/
├── User.model.js # Authentication & roles
├── Patient.model.js # Patient medical profiles
├── Doctor.model.js # Doctor professional profiles
├── Appointment.model.js # Scheduling & visit management
├── Prescription.model.js # Medical prescriptions
├── Allergy.model.js # Patient allergy records
├── AuditLog.model.js # Security & compliance logs


### Key Design Principles
- Separation of **authentication data** and **medical data**
- Proper use of MongoDB `ObjectId` references
- Schema-level validation
- Audit logging for sensitive operations

---

##  Database Indexing & Performance

To ensure high performance and scalability, **indexes are defined at the schema level**, including:

- Unique index on user email for fast authentication
- Compound index on appointments to prevent double booking
- Indexed foreign keys for fast patient, doctor, and prescription lookups

These indexes significantly reduce query time and ensure data integrity in high-traffic scenarios.

---

##  Seed Data & Testing

The project includes **seed scripts** to populate the database with realistic demo data for testing and demonstration.

src/seed/
├── seedUsers.js # Admin, Doctor, Nurse, Patient users
├── seedPatients.js # Patient medical profiles
├── seedPrescriptions.js # Sample prescriptions for AI testing


### Why Seed Data?
- Enables quick system setup
- Supports smooth project demonstration
- Validates database relationships
- Assists AI safety engine testing

---

## ▶️ Running the Project (Backend)

### 1. Install dependencies
```bash
npm install

