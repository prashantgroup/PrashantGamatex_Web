# Login Implementation Documentation

## Overview
This document describes the login functionality implementation for the Prashant Gamatex Web project.

## Architecture
The login functionality follows a clean architecture pattern with:
- **Service functions** for network requests
- **Custom TanStack Query hooks** for data fetching and mutations
- **Zustand store** for state management with persistence

## Files Created/Modified

### 1. Types (`src/types/auth.ts`)
- `LoginData`: Input data for login
- `AuthResponse`: API response structure
- `User`: User state structure
- `ErrorResponse`: Error handling structure

### 2. Validation (`src/lib/validations/auth.ts`)
- Zod schema for login form validation
- Type inference for form data

### 3. API Client (`src/lib/api.ts`)
- Axios instance with interceptors
- Automatic token attachment
- Error handling and token cleanup

### 4. Services (`src/services/auth.ts`)
- `login()`: Authentication service function
- `logout()`: Logout service function
- Error handling with proper typing

### 5. Zustand Store (`src/store/auth.ts`)
- Persistent authentication state
- User data management
- Local storage integration

### 6. Custom Hooks (`src/hooks/useAuth.ts`)
- `useLogin()`: TanStack Query mutation for login
- `useLogout()`: TanStack Query mutation for logout
- Automatic navigation and state updates

### 7. Components
- **QueryProvider** (`src/components/providers/query-provider.tsx`): React Query setup
- **Select Component** (`src/components/ui/select.tsx`): Company dropdown
- **LoginForm** (`src/components/login-form.tsx`): Complete login form with validation

### 8. Pages
- **Login Page** (`src/app/login/page.tsx`): Login interface
- **Dashboard Page** (`src/app/dashboard/page.tsx`): Protected dashboard with user info

## Features Implemented

### ✅ Form Validation
- Username, password, and company validation using Zod
- Real-time error display
- Form state management with react-hook-form

### ✅ Authentication Flow
- Login with username, password, and company selection
- Token storage in localStorage
- Automatic API request authentication
- Logout functionality with state cleanup

### ✅ State Management
- Zustand store with persistence
- User data and authentication status
- Automatic hydration on app load

### ✅ Error Handling
- Network error handling
- Form validation errors
- User-friendly error messages

### ✅ UI/UX
- Loading states during authentication
- Password visibility toggle
- Responsive design
- Clean, modern interface

## Environment Setup

Create a `.env.local` file with:
```
NEXT_PUBLIC_API_URL=your_api_endpoint_here
```

## Usage

### Login Flow
1. User enters credentials on `/login`
2. Form validates input using Zod schema
3. Service function makes API request
4. On success: token stored, user state updated, redirect to dashboard
5. On error: display error message

### Protected Routes
The dashboard page checks authentication status and redirects unauthenticated users.

### Logout Flow
1. User clicks logout button
2. API logout request (optional)
3. Clear local storage and state
4. Redirect to login page

## Dependencies Added
- `zod`: Schema validation
- `axios`: HTTP client
- `react-hook-form`: Form management
- `@hookform/resolvers`: Zod integration
- `@tanstack/react-query`: Data fetching (already installed)
- `zustand`: State management (already installed)

## API Integration
The implementation expects an API endpoint at `/auth/login` that accepts:
```json
{
  "user": {
    "username": "string",
    "password": "string", 
    "company": "PrashantGamatex" | "WestPoint" | "Serber",
    "DeviceName": "string"
  }
}
```

And returns:
```json
{
  "payload": {
    "uid": "string",
    "username": "string",
    "name": "string",
    "company": "string"
  },
  "token": "string"
}
```

## Next Steps
1. Set up your API endpoint URL in environment variables
2. Test the login flow with your backend
3. Add route protection middleware if needed
4. Customize the dashboard based on your requirements 