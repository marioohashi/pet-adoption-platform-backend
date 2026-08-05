# 🐾 Responsible Pet Adoption Platform — Backend

Backend service for the Responsible Pet Adoption Platform — a system designed to connect NGOs, donors, and adopters through a secure and transparent adoption workflow.  
Built with **Node.js, Express, TypeScript, Zod, JWT, PostgreSQL**, and optional **Prisma ORM**.

---

## 🚀 Overview

This backend provides a robust REST API that powers the entire adoption platform.  
It handles authentication, user roles, animal management, NGO operations, messaging, and the full adoption workflow.

---

## 🧱 Tech Stack

- Node.js  
- Express  
- TypeScript  
- Zod (schema validation)  
- JWT Authentication  
- PostgreSQL  
- Prisma ORM (optional)  
- Multer (file uploads)  
- Swagger (API documentation)

---

## 📌 Core Features

### 🔐 Authentication & Authorization
- Secure JWT-based login  
- Role-based access (adopter, donor, NGO)  
- Zod validation for all payloads

### 🐶 Animal Management
- CRUD operations for pets  
- Upload photos/videos  
- Status tracking (available, in process, adopted)

### 🏢 NGO Management
- Register NGOs with mission, history, contact info  
- Publish animals  
- Manage events and campaigns

### 🔎 Search & Filters
- Species, breed, age, size, behavior, location  
- Pagination and sorting

### 📨 Adoption Workflow
- Express interest in a pet  
- NGO receives notification  
- Secure messaging  
- Visit scheduling  
- Adoption approval

---

## 📂 Project Structure
src/
controllers/
services/
repositories/
models/
middlewares/
routes/
utils/


---

## 🔌 API Endpoints (Summary)

- `/auth` — login, register  
- `/users` — user profiles  
- `/ongs` — NGO management  
- `/animals` — pet CRUD  
- `/adoptions` — adoption workflow  
- `/messages` — secure chat  
- `/events` — NGO events & campaigns

---

## 🛠️ Setup

1. Install dependencies  
2. Configure `.env`  
3. Run database migrations  
4. Start the server

---

## 📄 License

MIT License

---

## 📫 Contact

**Mario Ohashi**  
Email: mario.ohashi@gmail.com  
Curitiba, Brazil

