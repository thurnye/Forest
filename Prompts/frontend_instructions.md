You are Claude acting as a senior Frontend Architect + React/TypeScript Engineer.

I want you to build the FRONTEND ONLY for the MVP of an AI-powered literacy learning web app (Lexia Core–style, simplified).
This frontend MUST be a SINGLE MONOLITHIC React application with a strict FEATURE-BASED (vertical slice) structure and strong separation of concerns.

Do NOT build the backend or AI engines. You may only define the API contracts the frontend will consume.

---

## ✅ MVP ROLES
There are only two roles:
1) Student
2) Parent/Teacher

Both roles live in the same React app with role-based routing and protected routes.

---

## 🧱 REQUIRED TECH STACK
- React + TypeScript
- Vite (preferred) or CRA (choose one and justify)
- React Router v6
- Redux Toolkit for state management (use slices per feature)
- Axios for HTTP
- React Hook Form + Zod (or Yup) for form validation (choose and justify)
- UI library: Material UI or Bootstrap (choose one and justify)

---

## ✅ REQUIRED USER FLOWS (MVP)
### Student
- Sign up / Sign in
- Take a short reading assessment (passage + questions)
- Submit assessment answers
- View results: reading level + AI feedback
- View assigned exercises
- Complete an exercise and submit
- View basic progress metrics

### Parent/Teacher
- Sign up / Sign in
- Link/add a student (child) OR invite student (recommend the best MVP approach and implement it)
- View student list
- View individual student progress
- Assign/unlock exercises manually
- View assessment summaries

---

## 🔌 API CONTRACTS (FRONTEND CONSUMES)
Assume a Node.js API gateway exists and returns JWT tokens.
You must:
- Create a centralized Axios client with interceptors (token injection, error normalization)
- Keep feature endpoints inside each feature’s `services/` folder, using the shared api client
- Define the endpoint paths and request/response shapes you will call (even if mocked)

Use MSW (Mock Service Worker) so the app can run fully locally without a backend.

---

## 🗂️ REQUIRED FEATURE-BASED FOLDER STRUCTURE (MUST FOLLOW EXACTLY)
Use this structure exactly and generate the full scaffold accordingly:

src/
├── app/
│   ├── hooks/
│   │   └── app.hooks.ts           # Typed Redux hooks
│   ├── stores/
│   │   └── stores.ts              # Centralized Redux store
│   ├── routes/
│   └── utils/
│
├── features/                       # Feature modules (3 features)
│   ├── auth/
│   ├── student/
│   └── parent_teacher/
│
├── shared/                         # Shared utilities
│   ├── services/
│   │   └── apiClient.service.ts  # Axios client with interceptors
│   ├── types/
│   │   └── api.types.ts          # Shared API types
│   └── utils/
│       ├── security.utils.ts     # Sanitization, validation, redaction
│       └── botDetection.utils.ts # Bot detection & fingerprinting
│
└── README.md

Each feature MUST follow this internal structure:

features/{feature}/
├── components/              # Feature-specific components
├── pages/                  # Feature pages/screens
├── services/               # API service
│   ├── {feature}.api.service.ts
│   └── socket.service.ts   # (message feature only)
├── redux/
│   └── slices/
│       └── {feature}.slice.ts
├── types/                  # Feature-specific types
├── mock/                  # Feature-specific mock data
├── hooks/                  # Feature-specific hooks
├── router/                  # Feature-specific routers
├── utils/                  # Feature-specific utilities
└── constants/              # Feature constants
---

## 🔒 ARCHITECTURE RULES (NON-NEGOTIABLE)
- Features must NOT import from other features directly.
- Shared must NOT import from app or features.
- App is wiring only: routes, store setup, global hooks.
- All API calls go through shared apiClient + feature service wrappers.
- All state is either: feature slice (Redux Toolkit) OR component local state (when appropriate).

---

## 📄 PAGES REQUIRED (MINIMUM)
### Auth feature
- Sign In
- Sign Up
- Role selection only if needed for MVP

### Student feature
- Student Dashboard
- Assessment
- Exercises List
- Exercise Detail/Attempt
- Progress

### Parent/Teacher feature
- Parent/Teacher Dashboard
- Student List
- Student Detail (progress + assessment results)
- Assign Exercise

---

## ✅ WHAT YOU MUST DELIVER
1) Generate the complete project scaffold (folders + files) exactly following the structure above.
2) Implement routing with protected routes and role gating:
   - /student/* for Student
   - /parent-teacher/* for Parent/Teacher
3) Implement Redux store + slices per feature (auth/student/parent_teacher).
4) Implement Axios api client with interceptors.
5) Implement MSW mocks for all required API endpoints so the app works without backend.
6) Implement the core UI pages with basic but clean layouts (MVP quality).
7) Add shared security utilities:
   - input sanitization helper
   - redaction helper for logs
   - basic bot detection/fingerprinting helper (simple MVP)
8) Provide a README with:
   - how to run
   - folder structure explanation
   - where to add endpoints later

---

## 🚫 OUT OF SCOPE (DO NOT BUILD)
- Payments/subscriptions
- Messaging/chat
- Push notifications
- Multi-tenant school admin panels
- Mobile apps

---

## OUTPUT INSTRUCTIONS
- Start by listing the full folder tree you will generate.
- Then generate files in a logical order (app wiring first, shared utilities, then features).
- Keep code clean, typed, and consistent.
- Use simple, maintainable patterns (no overengineering).

Begin now.

in this project, there is a prompts dir, inside contains the overview of 
this project. go through the overview.md and the frontend_instructions.md, 
after understanding the project, only implement the instructions in the 
frontend_instructions.md file for now. 