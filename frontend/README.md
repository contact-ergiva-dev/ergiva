# 🏥 Ergiva Frontend

Professional Physiotherapy Services Frontend Application built with Next.js, React, and TypeScript.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running on port 5000

### Installation
```bash
# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## ⚙️ Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Application Configuration
NEXT_PUBLIC_APP_NAME=Ergiva
NEXT_PUBLIC_CONTACT_EMAIL=support@ergiva.com
NEXT_PUBLIC_CONTACT_PHONE=+91-98765-43210

# Feature Flags
NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN=true
NEXT_PUBLIC_ENABLE_INSTAMOJO=true

# Development
NODE_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true
```

### Constants Configuration

All configuration constants are centralized in `src/config/constants.ts`:

```typescript
import { CONSTANTS, API_CONFIG, ERROR_MESSAGES } from '@/config/constants';

// Use constants instead of hardcoded values
const apiUrl = API_CONFIG.BASE_URL;
toast.error(ERROR_MESSAGES.NETWORK_ERROR);
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── config/             # Configuration constants
│   ├── lib/                # Utility libraries
│   │   ├── api.ts         # API client with interceptors
│   │   ├── auth/          # Authentication context
│   │   └── cart/          # Shopping cart context
│   ├── pages/              # Next.js pages
│   │   ├── admin/         # Admin panel pages
│   │   ├── auth/          # Authentication pages
│   │   └── ...            # Other pages
│   └── types/              # TypeScript type definitions
├── public/                  # Static assets
├── .env.example            # Environment variables template
└── README.md               # This file
```

## 🔐 Authentication

### User Authentication
- JWT-based authentication
- Google OAuth integration (handled by backend)
- Protected routes with automatic redirects
- Persistent login state with cookies

### Admin Authentication
- Separate admin login endpoint
- Role-based access control
- Admin dashboard with statistics

## 🛒 Features

### Core Functionality
- **User Management**: Registration, login, profile management
- **Product Catalog**: Browse products by category
- **Shopping Cart**: Add/remove items, quantity management
- **Order Management**: Place orders, track status
- **Session Booking**: Book physiotherapy sessions
- **Partner Registration**: Apply as physiotherapist partner

### Payment Integration
- **Cash on Delivery**: Primary payment method
- **Instamojo**: Online payment (coming soon)
- **Order Confirmation**: Email notifications

### Admin Panel
- **Dashboard**: Overview statistics and charts
- **Product Management**: CRUD operations for products
- **Order Management**: View and update order status
- **User Management**: Manage user accounts
- **Partner Applications**: Review and approve applications
- **Testimonials**: Manage customer testimonials

## 🎨 UI/UX Features

### Design System
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Component Library**: Reusable UI components
- **Icon System**: Heroicons integration

### User Experience
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: Success/error feedback
- **Form Validation**: Real-time input validation
- **Error Handling**: Graceful error states
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 Development

### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Code Quality
- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks

### API Integration
- **Axios**: HTTP client with interceptors
- **Error Handling**: Centralized error management
- **Authentication**: Automatic token management
- **Request/Response**: Logging and debugging

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile-First Features
- Touch-friendly interactions
- Swipe gestures for mobile
- Optimized navigation for small screens
- Progressive Web App (PWA) support

## 🚀 Performance

### Optimization
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components and images
- **Bundle Analysis**: Webpack bundle analyzer

### Caching
- **Static Generation**: Pre-rendered pages
- **API Caching**: Response caching strategies
- **Browser Caching**: Static asset caching

## 🔒 Security

### Frontend Security
- **Environment Variables**: Only public values exposed
- **Input Validation**: Client-side form validation
- **XSS Prevention**: React's built-in protection
- **CSRF Protection**: Token-based protection

### Data Protection
- **Sensitive Data**: Never stored in frontend
- **API Security**: HTTPS-only in production
- **Authentication**: Secure token handling
- **Session Management**: Automatic cleanup

## 🌐 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production API URLs
- Enable HTTPS
- Set up monitoring and analytics

### Deployment Platforms
- **Vercel**: Recommended for Next.js
- **Netlify**: Static site hosting
- **AWS**: S3 + CloudFront
- **Docker**: Containerized deployment

## 🐛 Troubleshooting

### Common Issues

#### Environment Variables Not Working
1. Ensure variables start with `NEXT_PUBLIC_`
2. Restart development server after changes
3. Check `.env` file location

#### Build Errors
1. Check TypeScript compilation
2. Verify all dependencies are installed
3. Clear `.next` folder and rebuild

#### API Connection Issues
1. Verify backend server is running
2. Check API URL configuration
3. Verify CORS settings on backend

### Debug Mode
Enable debug mode in `.env`:
```bash
NEXT_PUBLIC_DEBUG_MODE=true
```

## 📚 API Reference

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get user profile

### Product Endpoints
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `GET /api/products/categories/all` - List categories

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `PUT /api/orders/:id/status` - Update order status

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes and test
4. Submit pull request
5. Code review and merge

### Code Standards
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or questions:
- **Email**: support@ergiva.com
- **Phone**: +91-98765-43210
- **Documentation**: Check backend API docs

---

**Built with ❤️ for better healthcare delivery**
