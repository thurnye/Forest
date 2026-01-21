# Reading Forest - AI-Powered Literacy Learning Platform

A children's literacy platform focused on early reading development, built with React, TypeScript, and Material-UI.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Features](#features)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Testing](#testing)

## 🎯 Overview

Reading Forest is an MVP platform that helps young children learn to read through:

- Adaptive reading level assessments
- Personalized reading exercises
- Progress tracking for students
- Monitoring tools for parents and teachers
- AI-powered feedback (mocked in MVP)

## 🛠 Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **UI Library**: Material-UI (MUI)
- **Form Handling**: React Hook Form + Zod
- **API Mocking**: Mock Service Worker (MSW)

### Key Libraries

- `@reduxjs/toolkit` - State management
- `@mui/material` - UI components
- `react-hook-form` - Form validation
- `zod` - Schema validation
- `axios` - HTTP requests
- `msw` - API mocking for development

## 📁 Project Structure

```
src/
├── app/                        # Application-level configuration
│   ├── hooks/                  # Typed Redux hooks
│   │   └── app.hooks.ts
│   ├── stores/                 # Redux store setup
│   │   └── stores.ts
│   ├── routes/                 # Route guards and protection
│   │   ├── ProtectedRoute.tsx
│   │   └── PublicRoute.tsx
│   └── utils/                  # App-level utilities
│
├── features/                   # Feature modules (vertical slices)
│   ├── auth/                   # Authentication feature
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── SignInPage.tsx
│   │   │   └── SignUpPage.tsx
│   │   ├── services/
│   │   │   └── auth.api.service.ts
│   │   ├── redux/slices/
│   │   │   └── auth.slice.ts
│   │   ├── router/
│   │   │   └── auth.routes.tsx
│   │   ├── types/
│   │   ├── mock/
│   │   │   └── auth.mock.ts
│   │   └── hooks/
│   │
│   ├── student/                # Student feature
│   │   ├── pages/
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── AssessmentPage.tsx
│   │   │   ├── ExercisesListPage.tsx
│   │   │   ├── ExerciseDetailPage.tsx
│   │   │   └── ProgressPage.tsx
│   │   ├── services/
│   │   │   └── student.api.service.ts
│   │   ├── redux/slices/
│   │   │   └── student.slice.ts
│   │   ├── router/
│   │   │   └── student.routes.tsx
│   │   └── mock/
│   │       └── student.mock.ts
│   │
│   └── guardian/         # Parent/Teacher feature
│       ├── pages/
│       │   ├── ParentTeacherDashboard.tsx
│       │   ├── StudentListPage.tsx
│       │   ├── StudentDetailPage.tsx
│       │   └── AssignExercisePage.tsx
│       ├── services/
│       │   └── guardian.api.service.ts
│       ├── redux/slices/
│       │   └── guardian.slice.ts
│       ├── router/
│       │   └── guardian.routes.tsx
│       └── mock/
│           └── guardian.mock.ts
│
├── shared/                     # Shared utilities and services
│   ├── services/
│   │   └── apiClient.service.ts    # Axios client with interceptors
│   ├── types/
│   │   └── api.types.ts            # Shared TypeScript types
│   └── utils/
│       ├── security.utils.ts       # Input sanitization, validation
│       └── botDetection.utils.ts   # Bot detection helpers
│
├── mocks/                      # MSW mock handlers
│   ├── handlers.ts
│   └── browser.ts
│
├── App.tsx                     # Root application component
├── main.tsx                    # Application entry point
└── index.css                   # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ReadingForest
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to:

```
http://localhost:3000
```

### Test Accounts

The app comes with pre-configured test accounts (MSW mocks):

**Student Account:**

- Email: `student@test.com`
- Password: `any password`

**Parent Account:**

- Email: `parent@test.com`
- Password: `any password`

**Teacher Account:**

- Email: `teacher@test.com`
- Password: `any password`

## ✨ Features

### For Students

- ✅ Sign up / Sign in
- ✅ Take reading level assessments
- ✅ View personalized exercises
- ✅ Complete reading exercises with questions
- ✅ Track progress and scores

### For Parents/Teachers

- ✅ Sign up / Sign in
- ✅ Link existing students or create new student accounts
- ✅ View all linked students
- ✅ Monitor student progress and scores
- ✅ View assessment history
- ✅ Assign exercises to students

### Security Features

- ✅ Input sanitization
- ✅ XSS protection
- ✅ Password validation
- ✅ Rate limiting on forms
- ✅ Bot detection (basic)
- ✅ Sensitive data redaction in logs

## 🏗 Architecture

### Feature-Based Structure

The project follows a **feature-based (vertical slice)** architecture where each feature is self-contained:

- Each feature has its own pages, components, services, Redux slices, and routes
- Features do NOT import from each other directly
- Shared code lives in the `shared/` directory
- The `app/` directory handles global configuration

### Key Architectural Decisions

1. **Vite over CRA**: Faster build times and better developer experience
2. **Material-UI**: Comprehensive component library with good accessibility
3. **Redux Toolkit**: Simplified Redux with built-in best practices
4. **Zod over Yup**: Better TypeScript integration
5. **MSW for Mocking**: Allows full local development without backend

### State Management

- **Redux Toolkit** for global state (auth, student data, parent/teacher data)
- **React Hook Form** for form state
- Local component state for UI-specific concerns

### Routing Strategy

- `/login` and `/signup` - Public routes (redirect if authenticated)
- `/student/*` - Protected routes for students
- `/parent-teacher/*` - Protected routes for parents and teachers
- Role-based route guards prevent unauthorized access

## 🔌 API Endpoints

All API endpoints are currently mocked using MSW. The base URL is `http://localhost:5000/api`.

### Authentication

- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `GET /auth/me` - Get current user
- `GET /auth/verify` - Verify token

### Student

- `POST /student/assessment` - Submit assessment
- `GET /student/exercises` - Get exercises
- `GET /student/exercises/:id` - Get exercise by ID
- `POST /student/exercises/:id/submit` - Submit exercise answers
- `GET /student/progress` - Get student progress
- `GET /student/assessments` - Get assessment history

### Parent/Teacher

- `GET /parent-teacher/students` - Get all linked students
- `GET /parent-teacher/students/:id` - Get student detail
- `POST /parent-teacher/students/link` - Link existing student
- `POST /parent-teacher/students/create` - Create new student
- `POST /parent-teacher/students/:id/assign-exercise` - Assign exercise
- `GET /parent-teacher/exercises` - Get available exercises

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Adding New Features

1. Create a new folder in `src/features/`
2. Follow the existing structure:
   - `pages/` - Feature pages
   - `components/` - Feature-specific components
   - `services/` - API service layer
   - `redux/slices/` - Redux state management
   - `router/` - Feature routes
   - `mock/` - MSW mock handlers
   - `types/` - TypeScript types
3. Add the feature routes to `App.tsx`
4. Add the Redux slice to `app/stores/stores.ts`

### Adding New API Endpoints

1. Define the endpoint in the feature's API service (`services/`)
2. Create MSW mock handler in `mock/`
3. Add handler to `src/mocks/handlers.ts`
4. Create Redux async thunk in the feature slice if needed

### Code Style

- Use TypeScript for all files
- Follow existing naming conventions
- Use functional components with hooks
- Keep components focused and single-purpose
- Write descriptive variable and function names

## 🧪 Testing

### Manual Testing

1. Start the dev server: `npm run dev`
2. Test each user flow:
   - Student signup → assessment → exercises → progress
   - Parent signup → add student → view progress → assign exercise
   - Teacher signup → manage students

### MSW Mocking

All API requests are intercepted by MSW in development mode. To disable mocking:

- Remove or comment out the MSW initialization in `src/main.tsx`

## 🔐 Security

### Implemented Security Measures

1. **Input Sanitization**: All user inputs are sanitized before processing
2. **XSS Protection**: HTML sanitization using DOMPurify
3. **Password Validation**: Enforces strong password requirements
4. **Rate Limiting**: Basic client-side rate limiting on forms
5. **Bot Detection**: Simple bot detection mechanisms
6. **Token Storage**: JWT tokens stored in localStorage (consider httpOnly cookies for production)
7. **Sensitive Data Redaction**: Passwords and tokens redacted from logs

### Production Recommendations

- Implement httpOnly cookies for token storage
- Add CSRF protection
- Implement server-side rate limiting
- Add comprehensive bot detection
- Use environment variables for sensitive configuration
- Implement proper session management
- Add security headers (CSP, HSTS, etc.)

## 📝 Notes

### MVP Scope

This is an MVP implementation focused on core functionality:

- No payment/subscription system
- No real-time messaging
- No mobile app
- No advanced analytics
- AI feedback is mocked (not real AI)

### Future Enhancements

- Real AI integration for assessments and feedback
- Speech recognition for reading practice
- Gamification elements
- Social features
- Advanced progress analytics
- Mobile applications
- Multi-language support

## 🤝 Contributing

When contributing to this project:

1. Follow the established folder structure
2. Maintain TypeScript strict mode compliance
3. Add appropriate error handling
4. Update this README if adding new features
5. Test your changes thoroughly

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ for young learners**
