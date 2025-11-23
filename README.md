# প্রতিজ্ঞা (Protijja) - Frontend Application

## Software Requirements Specification (SRS)

### 1. Overview

**প্রতিজ্ঞা** is a comprehensive EdTech platform designed for Bangladesh, offering online courses, educational books, live classes, study notes, and examination systems. The frontend application provides an intuitive, responsive interface for students to access educational content and instructors/administrators to manage the platform.

**Platform Type:** Web Application  
**Target Audience:** Students, Administrators  
**Primary Language:** Bengali (বাংলা) with English support  
**Deployment:** Production-ready SPA

---

## 2. Technology Stack

### 2.1 Core Technologies

| Technology           | Version | Purpose                                           |
| -------------------- | ------- | ------------------------------------------------- |
| **React**            | 19.1.1  | UI library for building component-based interface |
| **Vite**             | 7.1.7   | Build tool and development server                 |
| **React Router DOM** | 7.9.3   | Client-side routing and navigation                |
| **Tailwind CSS**     | 4.1.14  | Utility-first CSS framework for styling           |

### 2.2 UI Component Libraries

- **Radix UI** - Headless, accessible component primitives
  - Alert Dialog, Checkbox, Dialog, Dropdown Menu
  - Label, Popover, Select, Slider, Switch
  - Tabs, Toggle, Tooltip, Collapsible
- **shadcn/ui** - Pre-styled components built on Radix UI
- **Lucide React** (0.544.0) - Icon library

### 2.3 State Management & Data Handling

- **Easy Peasy** (6.1.0) - Redux-based state management
- **Axios** (1.12.2) - HTTP client for API requests
- **React Hook Form** (7.64.0) - Form management and validation
- **Zod** (4.1.11) - Schema validation

### 2.4 Animation & Interactivity

- **Motion** (12.23.24) - Animation library (formerly Framer Motion)
- **GSAP React** (2.1.2) - Advanced animations
- **Embla Carousel React** (8.6.0) - Touch-friendly carousels

### 2.5 Additional Libraries

- **React PDF** (10.1.0) - PDF viewing capabilities
- **React Player** (3.3.3) - Video player component
- **React Hot Toast** (2.6.0) - Notification system
- **JWT Decode** (4.0.0) - JWT token handling
- **React Cookie** (8.0.1) - Cookie management
- **date-fns** (4.1.0) - Date manipulation
- **Recharts** (3.3.0) - Data visualization

---

## 3. Project Structure

```
Protigya-frontend/
│
├── public/                          # Static assets
│   ├── favicon.ico
│   ├── logo.png
│   ├── Payment1.png, Payment2.png, Payment3.png
│   ├── android-chrome-*.png
│   └── site.webmanifest
│
├── src/
│   ├── main.jsx                     # Application entry point
│   ├── App.jsx                      # Root component
│   ├── index.css                    # Global styles & Tailwind config
│   │
│   ├── assets/                      # Images, fonts, static files
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── BookCard.jsx
│   │   ├── CourseCard.jsx
│   │   ├── VideoPlayer.jsx
│   │   ├── OtpVerification.jsx
│   │   │
│   │   ├── Admin/                   # Admin-specific components
│   │   │   ├── Announcements/
│   │   │   ├── Books/
│   │   │   ├── Courses/
│   │   │   ├── Enrollments/
│   │   │   ├── Exams/
│   │   │   ├── LiveClasses/
│   │   │   ├── Notes/
│   │   │   ├── Orders/
│   │   │   ├── Promo/
│   │   │   └── Users/
│   │   │
│   │   ├── HomePage/                # Landing page components
│   │   │   ├── Hero.jsx
│   │   │   ├── FeaturedCourses.jsx
│   │   │   ├── FeaturedBooks.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── InstructorList.jsx
│   │   │
│   │   ├── checkout/                # Payment & checkout flow
│   │   │   ├── CheckoutForm.jsx
│   │   │   ├── CustomerInformation.jsx
│   │   │   └── OrderSummary.jsx
│   │   │
│   │   ├── shared/                  # Shared utility components
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── StudentDashboardLayout.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── PDFViewer.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── DevToolsProtection.jsx
│   │   │   └── ScrollToTop.jsx
│   │   │
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   ├── form.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── table.jsx
│   │   │   └── ... (25+ components)
│   │   │
│   │   └── UserDashboard/           # Student dashboard components
│   │
│   ├── pages/                       # Page-level components
│   │   ├── Public/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CoursesPage.jsx
│   │   │   ├── CourseDetailsPage.jsx
│   │   │   ├── BooksPage.jsx
│   │   │   ├── BookDetailsPage.jsx
│   │   │   ├── NotesPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── TermsConditionsPage.jsx
│   │   │   ├── PrivacyPolicyPage.jsx
│   │   │   ├── ReturnRefundPolicyPage.jsx
│   │   │   ├── AboutUsPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── auth/                    # Authentication pages
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── VerifyAccountPage.jsx
│   │   │
│   │   ├── Dashboard/               # Student dashboard pages
│   │   │
│   │   ├── Admin/                   # Admin panel pages
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── CoursesPage.jsx
│   │   │   ├── BooksPage.jsx
│   │   │   ├── EnrollmentsPage.jsx
│   │   │   ├── ExamsPage.jsx
│   │   │   ├── LiveClassesPage.jsx
│   │   │   └── ...
│   │   │
│   │   ├── payment/                 # Payment-related pages
│   │   └── student/                 # Student-specific pages
│   │
│   ├── routes/                      # Route definitions
│   │   ├── publicRoutes.jsx
│   │   ├── authRoutes.jsx
│   │   └── adminRoutes.jsx
│   │
│   ├── contexts/                    # React Context providers
│   │   └── AuthContext.jsx          # Authentication state
│   │
│   ├── store/                       # Easy Peasy state stores
│   │   ├── index.js
│   │   ├── adminStore.js
│   │   └── studentStore.js
│   │
│   ├── hooks/                       # Custom React hooks
│   │   └── useErrorHandler.js
│   │
│   ├── lib/                         # Utility functions
│   │   ├── api.js                   # Axios instance & interceptors
│   │   ├── utils.js                 # General utilities
│   │   ├── animations.js            # Animation presets
│   │   ├── helper.js                # Helper functions
│   │   ├── badgeUtils.jsx           # Badge generation logic
│   │   └── enrollmentUtils.js       # Enrollment utilities
│   │
│   └── config/                      # Configuration files
│       ├── data.js                  # Static data (team, contact, social)
│       └── checkout/
│           ├── data.js              # Checkout configurations
│           └── validationSchema.js  # Form validation schemas
│
├── index.html                       # HTML template with SEO meta tags
├── package.json                     # Dependencies and scripts
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── eslint.config.js                 # ESLint configuration
├── components.json                  # shadcn/ui configuration
└── README.md                        # This file
```

---

## 4. Core Functionality

### 4.1 Public Features

#### 4.1.1 Landing Page

- Hero section with CTAs
- Featured courses carousel
- Featured books showcase
- Instructor profiles
- Contact section with company information
- Responsive navigation

#### 4.1.2 Course Management

- Browse all courses
- Course detail view with curriculum
- Curriculum and Video management
- Enrollment information
- Pricing and promotional codes
- Related Course

#### 4.1.3 Book Store

- Browse educational books
- Book details with preview
- Pricing and availability

#### 4.1.4 Study Notes

- PDF viewer integration

#### 4.1.5 E-Commerce & Checkout

- Secure checkout flow
- Customer information form
- Multiple payment methods (SSLCommerz, COD)
- Delivery area selection (Dhaka inside/outside)
- Promo code application
- Order summary
- Mandatory terms & conditions acceptance (Required for Payment gateway)

### 4.2 Authentication & Authorization

- **User Registration** with OTP verification
- **Login/Logout** with JWT tokens
- **Protected Routes** with role-based access
- **Password Recovery** (forgot password flow)
- **Session Management** with cookies
- **Token Refresh** mechanism (handled by backend)

### 4.3 Student Dashboard

- **Enrolled Courses** - Access purchased courses
- **Live Classes** - Schedule and join live sessions (Zoom)
- **Exam Portal** - Take online exams
- **Profile Management** - Update personal information
- **Order History** - View past purchases for courses and books

### 4.4 Admin Panel

#### 4.4.1 Content Management

- **Courses**
  - Create/Edit/Delete courses
  - Manage curriculum and modules
  - Upload videos and materials
  - Set pricing and and information
  - Set related books
- **Books**

  - Add/Update/Remove books
  - Upload PDF previews
  - Manage inventory
  - Set pricing and other information

- **Notes**

  - Upload study materials
  - Categorize by batch

- **Live Classes**

  - Schedule classes links

- **Exams**
  - Schedule exams

#### 4.4.2 User Management

- View all users
- Manage enrollments
- Block/Unblock users
- View user activity
- User details and enrollment history

#### 4.4.3 Order Management

- View all orders
- Order status updates
- Download selective date range order -> Excel
- Individual Order information

#### 4.4.4 Marketing & Promotions

- Create promo codes
- Discount management
- Campaign tracking
- Announcements system

#### 4.4.5 Analytics Dashboard

- Sales statistics with Recharts
- Enrollment metrics
- Book and Course sell charts
- Revenue reports

### 4.5 Additional Features

- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Meta tags, structured data, sitemap
- **Accessibility** - WCAG compliant components
- **Error Handling** - Global error boundary
- **Loading States** - Skeleton screens and spinners
- **Toast Notifications** - User feedback system
- **Form Validation** - Real-time validation with Zod
- **Pagination** - Efficient data loading
- **Search & Filter** - Content discovery
- **DevTools Protection** - Prevent console access in production

---

## 5. Design System

### 5.1 Color Palette

Based on `index.css` configuration:

```css
--color-primary: oklch(0.45 0.15 250); /* Navy Blue #1e40af */
--color-secondary: oklch(0.72 0.09 190); /* Teal #14b8a6 */
--color-background: oklch(1 0 0); /* White */
--color-foreground: oklch(0.15 0 0); /* Dark text */
--color-muted: oklch(0.96 0 0); /* Light gray */
--color-accent: oklch(0.96 0.01 250); /* Accent blue */
--color-destructive: oklch(0.58 0.21 25); /* Red for errors */
```

### 5.2 Typography

- **Primary Font:** Inter (Google Fonts)
- **Bengali Font:** Hind Siliguri (Google Fonts)
- **Font Weights:** 100-900 (variable)

### 5.3 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 6. API Integration

### 6.1 Base Configuration

- **API Client:** Axios with interceptors
- **Base URL:** Configured in `lib/api.js`
- **Authentication:** JWT Bearer tokens
- **Error Handling:** Centralized error interceptor

## 7. State Management

### 7.1 Global State (Easy Peasy)

- **Admin Store:** Admin-specific state
- **Student Store:** Student dashboard state

### 7.2 Context API

- **AuthContext:** Authentication state, user info, login/logout methods

---

## 8. Routing Structure

### 8.1 Public Routes

- `/` - Home page
- `/courses` - Course listing
- `/courses/:slug` - Course details
- `/books` - Book listing
- `/books/:slug` - Book details
- `/notes` - Study notes
- `/checkout` - Checkout page
- `/terms-conditions` - Terms & Conditions
- `/privacy-policy` - Privacy Policy
- `/return-refund-policy` - Return & Refund Policy
- `/about-us` - About Us page

### 8.2 Auth Routes

- `/auth/login` - Login page
- `/auth/register` - Registration
- `/auth/verify` - OTP verification

### 8.3 Protected Routes (Student)

- `/dashboard` - Student dashboard
- `/dashboard/courses` - My courses
- `/dashboard/profile` - Profile settings

### 8.4 Protected Routes (Admin)

- `/admin` - Admin dashboard
- `/admin/courses` - Manage courses
- `/admin/books` - Manage books
- `/admin/users` - User management
- `/admin/orders` - Order management
- `/admin/enrollments` - Enrollment management

---

## 9. Security Features

- **JWT Authentication:** Secure token-based auth
- **HTTPS Only:** Enforced SSL
- **XSS Protection:** Input sanitization
- **CSRF Protection:** Token validation
- **DevTools Protection:** Console access prevention
- **Content Security Policy:** Configured in headers

---

## 10. Development & Build

### 10.1 Scripts

```bash
npm run dev       # Start development server (Vite)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### 10.2 Environment Variables

```env
VITE_API_BASE_URL=<backend-api-url>
```

---

## 16. Contact & Support

- **Email:** tazwoarbusiness@gmail.com
- **Phone:** +880 1533-381836
- **Facebook:** https://www.facebook.com/Momentazwoarmomit
- **YouTube:** https://www.youtube.com/@momentazwoarmomit

---

## License

Proprietary - © 2024-2025 প্রতিজ্ঞা Education Platform. All rights reserved.

Developed by [Enovosoft](http://enovosoft.com/)
