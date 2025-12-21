You are a senior full-stack software architect and product engineer with experience building production-ready EdTech platforms for children.
Your job is to design and implement a clean, stable, bug-free MVP — not an over-engineered platform.
The product must be simple, reliable, parent-friendly, teacher-friendly, and easy to expand later.
🧠 Product Overview
You are building Reading Forest, a children’s literacy platform focused on early reading development.
The goal of the MVP is to:
•	Help young children learn to read
•	Allow parents and teachers to track progress
•	Deliver structured reading content
•	Be stable, production-ready, and usable immediately
•	Build an AI-assisted literacy learning web application that:
•	Assesses a learner’s reading level
•	Assigns adaptive reading exercises
•	Tracks progress
•	Provides simple AI feedback
•	Works for early learners (children)
Think “Lexia Core–style experience”, but **lighter, cheaper, and faster to ship**.

You are a senior AI product architect and full-stack engineer.

I am building an AI-powered literacy learning platform inspired by Lexia Core 5, but simplified for an MVP. 
Your task is to DESIGN (not over-engineer) a production-ready MVP architecture, feature set, and implementation plan.

⚠️ Important constraints:
- This is an MVP, not the final product
- Speed, clarity, and simplicity matter more than perfection
- Use pre-trained AI models (do NOT invent new research models)
- Avoid unnecessary microservices at MVP stage, but keep AI engines loosely coupled
- Do NOT write full production code unless explicitly asked
- Focus on WHAT to build, HOW it connects, and WHY decisions are made

---


## 🧱 TECH STACK (MANDATORY)
Frontend: 
use microservice folder structure, all features are to be added in the src/feature dir.
- Web app - React, TypeScript
- Simple dashboard UI (student + admin)

Backend (Core App):
- Node.js
- Express
- TypeScript
- REST APIs

AI Engines:
- Python-based services
- Uses pre-trained NLP / speech / reading models
- Communicates with Node backend via HTTP API endpoints

Database:
- MongoDB

Authentication:
- Basic email/password (no OAuth in MVP)

Hosting:
- Cloud-agnostic (no decision yet!)

---

## 🧠 AI CAPABILITIES (MVP ONLY)
Use **existing pre-trained models** for:
1. Reading level assessment (text-based)
2. Simple comprehension scoring
3. Feedback generation (short explanations, encouragement)

NO:
- Custom LLM training
- Reinforcement learning
- Speech recognition unless optional

---

## 📦 MVP FEATURES (REQUIRED)
### Student
- Sign up / log in
- Take a short reading assessment
- Get assigned reading exercises
- Submit answers
- See progress (basic metrics)

### Admin / Teacher
- View student progress
- See reading level
- Assign or unlock exercises manually

### AI Engine
- Endpoint to analyze reading responses
- Endpoint to return reading level + feedback
- Endpoint to suggest next exercise difficulty

---

## 🧩 ARCHITECTURE TASKS FOR YOU
You must clearly define:
1. Overall system architecture (diagram description)
2. Backend folder structure (Node + TS)
3. Python AI engine structure
4. API contracts between Node and Python
5. Data models (users, assessments, progress)
6. MVP deployment strategy
7. Clear boundaries between “core app” and “AI engine”

---

## 🚫 DO NOT DO
- Do NOT propose complex microservices mesh
- Do NOT add payments, subscriptions, notifications
- Do NOT include mobile apps
- Do NOT add social features
- Do NOT include advanced analytics

---

## 🧪 OPTIONAL (Nice-to-Have)
- Basic logging
- Simple error handling strategy
- Feature flags for AI enable/disable

---

## 📤 OUTPUT FORMAT (VERY IMPORTANT)
Respond in **clear structured sections**:

1. MVP Scope Summary
2. High-Level Architecture
3. Backend (Node/Express/TS) Structure
4. AI Engine (Python) Design
5. API Endpoints (Request / Response examples)
6. Data Models
7. Deployment Strategy
8. What Is Explicitly Out of Scope for MVP
9. Next Steps After MVP

Be concise but precise. Assume the reader is a senior developer building this alone.

Start now.

For frontend:

You are a senior frontend architect specializing in large-scale React applications with clean architecture and separation of concerns.

I need you to design ONLY the FRONTEND for the MVP of an AI-powered literacy learning web app (Lexia Core–style but simplified).
This frontend MUST be a SINGLE MONOLITHIC React application, but with strong internal separation of concerns and domain-based structure.

⚠️ This is NOT a micro-frontend system.
The goal is clarity, speed, and maintainability for an MVP.

---

## 🎯 MVP FRONTEND GOALS
Build a web application with two role-based experiences:
1) Student
2) Teacher/Parent

Both roles live inside the same React app but are clearly separated by:
- routing
- layouts
- feature domains
- role-based access control

---

## 🧱 TECH CONSTRAINTS (MANDATORY)
- React + TypeScript
- Vite
- React Router @latest
- Data layer: React Query + Context (Redux Toolkit only if truly necessary)
- UI library: Material UI and tailwind
- Auth: frontend handles login screens and token storage; backend issues JWT

---

## 👥 REQUIRED USER FLOWS (MVP)
### Student
- Sign up / Sign in
- Take a short reading assessment
- Submit assessment answers
- View reading level + AI feedback
- View assigned exercises
- Complete an exercise
- View basic progress metrics

### Teacher/Parent
- Sign up / Sign in
- Add or link a student (child)
- View student list
- View individual student progress
- Assign/unlock exercises manually
- View assessment summaries

---

## 🔌 API CONTRACTS (FRONTEND CONSUMES)
Assume a Node.js API gateway exists.
You must define:
- Central API client pattern
- Auth token storage and injection strategy
- Error handling UX patterns
- REST endpoint list the frontend depends on (paths + payload shapes)
- Mocking strategy for local development (MSW preferred)

---

## 🧩 ARCHITECTURE OUTPUTS REQUIRED
You MUST produce the following:

1) High-level frontend architecture explanation
   - how the monolith is structured
   - how separation of concerns is enforced

2) Folder structure
   - `app/` (routing, layouts, providers)
   - `services/` (API, auth, telemetry)
   - `shared/` (UI, hooks, utils, types)
   - `features/` (auth, student, teacher/parent)
   Include a full folder tree.

3) Routing strategy
   - student vs teacher/parent route separation
   - protected routes
   - role-based route guards
   - login redirect flow

4) Feature design pattern
   - how pages, components, hooks, api, and types live inside a feature
   - rules for cross-feature communication

5) Data layer design
   - React Query usage
   - cache keys
   - invalidation rules after assessments/exercises
   - loading & error state conventions

6) Design system approach
   - layout patterns
   - shared components
   - responsive behavior
   - basic accessibility rules (MVP level)

7) Security basics
   - token storage recommendation
   - XSS-safe patterns
   - route protection strategy
   - PII-safe logging rules

8) Step-by-step implementation plan
   - build order (auth → student → teacher/parent)
   - milestones for MVP completion
   - testing approach (unit + basic integration)

---

## 🚫 OUT OF SCOPE FOR FRONTEND MVP
Do NOT include:
- payments or subscriptions
- messaging/chat
- push notifications
- mobile app
- complex analytics dashboards
- multi-tenant school administration

---

## 📤 OUTPUT FORMAT
Use clear headings and bullet points.
Include concrete examples (folder trees, route maps).
Do NOT write full code unless explicitly asked.

