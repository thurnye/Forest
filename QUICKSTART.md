# Quick Start Guide - Reading Forest

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to `http://localhost:3000`

## 🔑 Test Accounts

The app includes mock data with pre-configured accounts:

### Student
- **Email**: `student@test.com`
- **Password**: any password works
- **Features**: Take assessments, complete exercises, view progress

### Parent
- **Email**: `parent@test.com`
- **Password**: any password works
- **Features**: Add students, monitor progress, assign exercises

### Teacher
- **Email**: `teacher@test.com`
- **Password**: any password works
- **Features**: Manage students, view progress, assign exercises

## 📱 User Flows to Test

### Student Flow
1. Sign in with student@test.com
2. Click "Start Assessment"
3. Answer the 3 questions
4. View your reading level result
5. Go to "View Exercises"
6. Click on an exercise and complete it
7. Check your progress

### Parent/Teacher Flow
1. Sign in with parent@test.com
2. View linked students (2 pre-populated)
3. Click on a student to view details
4. See their progress and assessments
5. Click "Assign Exercise"
6. Select an exercise to assign

### Create New Account
1. Click "Sign Up"
2. Fill in the form
3. Choose role (Student/Parent/Teacher)
4. Create password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
5. Sign in with new account

## 🛠 Available Commands

```bash
# Development
npm run dev          # Start dev server with hot reload

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🎨 Features Included

### ✅ Authentication
- Sign up / Sign in
- Role-based routing (Student, Parent, Teacher)
- Protected routes
- Token-based authentication

### ✅ Student Features
- Reading level assessments
- Practice exercises with questions
- Progress tracking
- Score history

### ✅ Parent/Teacher Features
- Student management
- Link existing or create new students
- Monitor student progress
- Assign exercises
- View assessment results

### ✅ Security
- Input sanitization
- XSS protection
- Password validation
- Rate limiting
- Bot detection

## 🔧 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI**: Material-UI
- **State**: Redux Toolkit
- **Forms**: React Hook Form + Zod
- **Routing**: React Router v6
- **API Mocking**: MSW (Mock Service Worker)

## 📂 Project Structure

```
src/
├── app/           # App configuration (store, routes, hooks)
├── features/      # Feature modules
│   ├── auth/      # Authentication
│   ├── student/   # Student features
│   └── parent_teacher/  # Parent/Teacher features
├── shared/        # Shared utilities
└── mocks/         # API mocks (MSW)
```

## 🐛 Troubleshooting

### Port already in use
```bash
# The app runs on port 3000 by default
# If port 3000 is in use, Vite will suggest another port
```

### Dependencies not installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Make sure you're using Node.js 18+
node --version

# Clean and rebuild
npm run build
```

## 📖 Next Steps

1. **Read the full README.md** for detailed architecture information
2. **Explore the code** - start with `src/App.tsx`
3. **Check the API services** in `src/features/*/services/`
4. **Review Redux slices** in `src/features/*/redux/slices/`
5. **Customize the theme** in `src/App.tsx`

## 💡 Tips

- All API calls are mocked using MSW - no backend needed
- Hot reload is enabled - changes appear instantly
- TypeScript strict mode is enabled for better type safety
- Material-UI theme can be customized in `App.tsx`
- Form validation uses Zod schemas

## 🔗 Important Files

- `src/App.tsx` - Main app component and routing
- `src/main.tsx` - App entry point
- `src/app/stores/stores.ts` - Redux store configuration
- `src/shared/services/apiClient.service.ts` - API client setup
- `src/mocks/handlers.ts` - MSW mock handlers

---

**Happy Coding! 🌲**
