# NGO Reports Management System - Frontend

A modern React application for managing NGO monthly reports with real-time submission, bulk CSV uploads, and an intuitive admin dashboard.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Pages & Features](#pages--features)
- [Components](#components)
- [Styling](#styling)
- [Development](#development)

---

## Features

### 1. **Home Page - Individual Report Submission**
   - Simple form interface for NGO report submission
   - Real-time form validation
   - Submit single monthly reports with:
     - NGO ID
     - Month (date picker)
     - People Helped (number)
     - Events Conducted (number)
     - Funds Utilized (currency input)
   - Success notifications
   - Quick link to bulk upload feature

### 2. **Bulk CSV Upload**
   - Drag-and-drop CSV file upload interface
   - Real-time job progress tracking
   - Live progress bar showing processed vs failed rows
   - Job ID display for reference
   - Detailed error reporting with row numbers
   - Toggle to view/hide failed rows
   - Status updates (pending, processing, completed, failed)

### 3. **Admin Dashboard**
   - Protected route - requires authentication
   - Month-based filtering with date picker
   - Real-time search by NGO ID (case-insensitive)
   - Advanced sorting on all columns:
     - NGO ID
     - People Helped
     - Events Conducted
     - Funds Utilized
   - Bi-directional sort (ascending/descending)
   - Pagination with configurable limits
   - Statistical cards showing:
     - Total NGOs
     - Total People Helped
     - Total Events Conducted
     - Total Funds Utilized

### 4. **Admin Authentication**
   - Secure login page with JWT token management
   - Email and password authentication
   - Password visibility toggle
   - Session persistence using localStorage
   - Automatic logout functionality
   - Protected route redirection

### 5. **Navigation & Routing**
   - Fixed navbar with responsive design
   - Easy navigation between all pages
   - Dynamic button visibility based on auth status
   - Quick access to dashboard for logged-in admins
   - One-click logout

---

## Tech Stack

### Frontend Framework & Build
- **React**: v19.2.0 - UI library
- **Vite**: v7.2.4 - Fast build tool with HMR
- **React Router**: v7.10.1 - Client-side routing

### Styling & UI
- **Tailwind CSS**: v3.4.19 - Utility-first CSS framework
- **Framer Motion**: v12.23.26 - Smooth animations and transitions
- **Chakra UI**: v3.30.0 - Component library (optional)
- **PostCSS**: v8.5.6 - CSS transformation
- **Autoprefixer**: v10.4.23 - Vendor prefixes

### State & API
- **Fetch API**: Built-in browser API for HTTP requests
- **localStorage**: For token persistence

### Development & Code Quality
- **ESLint**: v9.39.1 - Code linting
- **React Hooks ESLint Plugin**: v7.0.1 - Hook rules
- **React Refresh**: v0.4.24 - Fast refresh for development

---

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm run lint
   ```

---

## Configuration

### API Base URL
Update the API endpoint in component files (currently set to `http://localhost:5000`):

To change the API URL, update the `API` constant in:
- `src/pages/Home.jsx`
- `src/pages/BulkUpload.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/AdminLogin.jsx`

```javascript
const API = "http://localhost:5000"; // Change this
```

### Environment Setup (Optional)
Create a `.env` file for environment variables:
```env
VITE_API_URL=http://localhost:5000
```

Then update components to use:
```javascript
const API = import.meta.env.VITE_API_URL;
```

---

## Running the Application

### Development Server
```bash
npm run dev
```
- Starts dev server at `http://localhost:5173`
- Enables Hot Module Replacement (HMR)
- Auto-reloads on file changes
- Shows all linting errors in browser

### Preview Production Build
```bash
npm run preview
```
- Preview the optimized production build locally
- Useful for testing before deployment

---

## Building for Production

### Build Optimization
```bash
npm run build
```
- Compiles React to optimized JavaScript
- Minifies CSS and JavaScript
- Generates source maps
- Output directory: `dist/`

### Build Output
```
dist/
├── index.html
├── assets/
│   ├── index-xxxxx.js
│   ├── index-xxxxx.css
│   └── vendor-xxxxx.js
```

### Deployment Steps

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Test the build locally**
   ```bash
   npm run preview
   ```

3. **Deploy the `dist/` folder to your hosting**
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3
   - Any static hosting service

### Production Checklist
- [ ] Update API URL to production backend
- [ ] Enable HTTPS
- [ ] Configure CORS if needed
- [ ] Set up environment variables
- [ ] Test all authentication flows
- [ ] Verify CSV upload functionality
- [ ] Check responsive design on mobile
- [ ] Test on different browsers

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar with auth controls
│   │   └── ProtectedRoute.jsx  # Route protection wrapper
│   ├── pages/
│   │   ├── Home.jsx            # Individual report submission
│   │   ├── BulkUpload.jsx      # CSV upload with progress tracking
│   │   ├── Dashboard.jsx       # Admin dashboard with analytics
│   │   └── AdminLogin.jsx      # Authentication page
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # React DOM entry point
│   └── index.css               # Global styles
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── eslint.config.js            # ESLint rules
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

---

## Pages & Features

### 1. Home Page (`/`)
**File**: `src/pages/Home.jsx`

Features:
- Individual report submission form
- Real-time form field updates
- Submit button for posting reports
- Link to bulk upload feature
- Success/error notifications

Form Fields:
```
- NGO ID (text)
- Month (month picker)
- People Helped (number)
- Events Conducted (number)
- Funds Utilized (currency number)
```

API Integration:
```
POST /report
{
  ngoId, month, peopleHelped, 
  eventsConducted, fundsUtilized
}
```

---

### 2. Bulk Upload Page (`/bulk`)
**File**: `src/pages/BulkUpload.jsx`

Features:
- Drag-and-drop CSV upload
- File selection dialog
- Upload progress tracking
- Real-time job status polling (2-second intervals)
- Success/error messaging
- Detailed error display with row numbers
- Progress bar visualization

Expected CSV Format:
```csv
ngoId,month,peopleHelped,eventsConducted,fundsUtilized
NGO-001,2025-01,150,5,50000
NGO-002,2025-01,200,8,75000
```

API Integration:
```
POST /reports/upload (multipart/form-data)
Response: { jobId, message }

GET /job-status/:jobId (polling)
Response: { status, processedRows, failedRows, errors[] }
```

---

### 3. Admin Dashboard (`/dashboard`)
**File**: `src/pages/Dashboard.jsx`

Features:
- Protected route (redirects to login if no token)
- Monthly report filtering
- NGO ID search (case-insensitive)
- Multi-field sorting with visual indicators (↑↓)
- Pagination (10 items per page)
- Statistical summary cards
- Responsive table layout

Sorting Options:
- NGO ID (default)
- People Helped
- Events Conducted
- Funds Utilized

Statistics Displayed:
- Total NGOs in month
- Total People Helped
- Total Events Conducted
- Total Funds Utilized (formatted as ₹)

API Integration:
```
GET /dashboard?month=2025-01&page=1&limit=10&search=&sortBy=ngoId&order=asc
Headers: Authorization: Bearer <token>

Response: 
{
  totals: { totalNGOs, totalPeopleHelped, totalEvents, totalFunds },
  rows: [ { _id, ngoId, month, ... } ],
  pagination: { page, limit, totalCount, totalPages }
}
```

---

### 4. Admin Login Page (`/admin`)
**File**: `src/pages/AdminLogin.jsx`

Features:
- Email input field
- Password input with visibility toggle
- Remember password toggle (password reveal eye icon)
- Loading state during authentication
- Error message display
- Responsive form layout
- Auto-redirect to dashboard on successful login

Login Flow:
1. Enter email and password
2. Click Login button
3. Receives JWT token from backend
4. Stores token in localStorage
5. Redirects to `/dashboard`

API Integration:
```
POST /auth/login
{
  email: "test@example.com",
  password: "123456"
}

Response: { token: "jwt_token_here" }
```

---

## Components

### Navbar (`src/components/Navbar.jsx`)
**Purpose**: Main navigation and authentication controls

Features:
- Logo/brand button (links to home)
- Dynamic button rendering based on auth state
- Admin Login button (visible when not authenticated)
- Dashboard button (visible when authenticated)
- Logout button (visible when authenticated)
- Fixed positioning
- Responsive spacing

### ProtectedRoute (`src/components/ProtectedRoute.jsx`)
**Purpose**: Protect routes from unauthorized access

Features:
- Checks for JWT token in localStorage
- Redirects to `/admin` if no token
- Allows access to protected pages if authenticated
- Used for Dashboard route protection

```javascript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## Styling

### Tailwind CSS
- Utility-first CSS framework
- Responsive design out of the box
- Mobile-first approach
- Custom configuration in `tailwind.config.js`

### Key Utility Classes Used
- Layout: `flex`, `grid`, `max-w-*`, `mx-auto`
- Spacing: `p-*`, `m-*`, `gap-*`
- Colors: `bg-*`, `text-*`, `border-*`
- States: `hover:`, `focus:`, `disabled:`
- Responsive: `sm:`, `md:`, `lg:` prefixes

### Global Styles
File: `src/index.css`
- Tailwind directives
- Base styles
- Component utilities

---

## Development

### Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint on all files |

### Code Quality

**ESLint Configuration**
- Checks for common JavaScript errors
- React-specific rules (hooks, refresh)
- Enforces code style consistency

Run linting:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint -- --fix
```

### Hot Module Replacement (HMR)
- Enabled by default in dev mode
- Preserves component state during edits
- Instant feedback on changes

### Browser DevTools

#### React DevTools
- Chrome/Firefox extension for React debugging
- Component tree inspection
- Props and state inspection
- Performance profiling

#### Network Tab
- Monitor API requests
- Check response status and data
- Debug authentication issues

---

## Common Issues & Solutions

### CORS Errors
**Problem**: API requests blocked by browser
**Solution**: Ensure backend has CORS enabled or update API URL

### Authentication Fails
**Problem**: Login page redirects back to login
**Solution**: 
- Verify backend is running
- Check API URL is correct
- Check credentials are correct

### Bulk Upload Not Processing
**Problem**: Job status shows pending indefinitely
**Solution**:
- Verify CSV format is correct
- Check backend worker is running (`RUN_WORKER=true`)
- Check Redis connection

### Styling Issues
**Problem**: Tailwind classes not applied
**Solution**:
- Run `npm install`
- Rebuild with `npm run build`
- Clear browser cache
- Check tailwind.config.js includes all template paths

---

## Performance Tips

1. **Code Splitting**: React Router automatically code-splits pages
2. **Image Optimization**: Use optimized images
3. **Bundle Size**: Check with `npm run build` and review dist size
4. **API Caching**: Implement caching strategies for dashboard data
5. **Lazy Loading**: Use React.lazy() for heavy components

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Troubleshooting

### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Cache Issues
```bash
npm cache clean --force
npm install
```

### Port Already in Use
```bash
# Change port in vite.config.js or use:
npm run dev -- --port 3000
```

---

## Contributing

1. Follow ESLint rules
2. Test features before committing
3. Update documentation for new features
4. Keep components small and reusable

---

## License

ISC
