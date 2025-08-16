# 🏥 Ergiva Backend API

Professional Physiotherapy Services Backend API built with Node.js, Express, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Set up database (see Database Setup section)
npm run migrate

# Start development server
npm run dev
```

The API will be available at `http://localhost:5000`

## ⚙️ Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/ergiva_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ergiva_db
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=5000
NODE_ENV=development
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Authentication & Security
JWT_SECRET=your_super_secret_jwt_key_here
SESSION_SECRET=your_session_secret_key_here
BCRYPT_ROUNDS=10

# Google OAuth (Backend Only)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=/api/auth/google/callback

# Payment Gateway Secrets (Backend Only)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET_KEY=your_razorpay_secret_key
INSTAMOJO_API_KEY=your_instamojo_api_key
INSTAMOJO_AUTH_TOKEN=your_instamojo_auth_token

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🗄️ Database Setup

### 1. Create Database
```sql
CREATE DATABASE ergiva_db;
```

### 2. Run Initial Schema
```sql
-- Run the SQL from database.sql file
\i database.sql
```

### 3. Run Migrations
```bash
# Run database migrations
npm run migrate
```

### 4. Verify Setup
```bash
# Check database connection
npm run test:db
```

## 🏗️ Project Structure

```
backend/
├── config/                 # Configuration files
│   ├── database.js        # Database connection
│   └── passport.js        # Passport authentication
├── middleware/             # Custom middleware
│   └── auth.js            # Authentication middleware
├── routes/                 # API route handlers
│   ├── auth.js            # Authentication routes
│   ├── products.js        # Product management
│   ├── categories.js      # Category management
│   ├── orders.js          # Order management
│   ├── sessions.js        # Session booking
│   ├── partners.js        # Partner applications
│   ├── testimonials.js    # Testimonials
│   └── admin.js           # Admin dashboard
├── services/               # Business logic services
│   ├── emailService.js    # Email functionality
│   └── instamojoService.js # Payment processing
├── server.js               # Main application entry point
├── migrate.js              # Database migration script
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🔐 Authentication System

### JWT Authentication
- **Token-based** authentication for API endpoints
- **Automatic token validation** via middleware
- **Secure token storage** with configurable expiration

### Google OAuth Integration
- **Passport.js** strategy for Google authentication
- **Automatic user creation** for new OAuth users
- **Profile linking** for existing users

### Session Management
- **Express-session** for persistent sessions
- **Passport session** integration
- **Secure cookie** configuration

## 🛒 API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /register` - User registration
- `POST /admin/login` - Admin login
- `GET /me` - Get user profile
- `PUT /profile` - Update user profile
- `GET /google` - Google OAuth login
- `GET /google/callback` - Google OAuth callback
- `GET /validate` - Validate JWT token

### Products (`/api/products`)
- `GET /` - List all products
- `GET /:id` - Get product details
- `GET /featured` - Get featured products
- `GET /categories/all` - List all categories
- `POST /` - Create new product (admin)
- `PUT /:id` - Update product (admin)
- `DELETE /:id` - Delete product (admin)

### Orders (`/api/orders`)
- `POST /` - Create new order
- `GET /my-orders` - Get user orders
- `GET /:id` - Get order details
- `PUT /:id/status` - Update order status (admin)
- `GET /admin/all` - Get all orders (admin)

### Sessions (`/api/sessions`)
- `POST /book` - Book physiotherapy session
- `GET /my-sessions` - Get user sessions
- `GET /:id` - Get session details
- `PUT /:id/status` - Update session status (admin)
- `GET /admin/all` - Get all sessions (admin)

### Partners (`/api/partners`)
- `POST /apply` - Submit partner application
- `GET /application/:id/status` - Check application status
- `GET /admin/all` - Get all applications (admin)
- `PUT /admin/:id/review` - Review application (admin)

### Testimonials (`/api/testimonials`)
- `GET /` - List all testimonials
- `GET /featured` - Get featured testimonials
- `GET /:id` - Get testimonial details
- `POST /` - Create testimonial (admin)
- `PUT /:id` - Update testimonial (admin)
- `DELETE /:id` - Delete testimonial (admin)

### Admin (`/api/admin`)
- `GET /dashboard` - Dashboard statistics
- `GET /recent-activities` - Recent system activities
- `GET /system-health` - System health check
- `GET /users` - User management (admin)
- `PUT /users/:id/admin` - Update user admin status

## 💳 Payment Integration

### Instamojo Service
- **Payment request creation** for online payments
- **Webhook processing** for payment confirmations
- **Payment status verification** for order completion

### Razorpay Integration
- **Session booking payments** via Razorpay
- **Order creation** and payment processing
- **Payment verification** and confirmation

### Cash on Delivery
- **Default payment method** for orders
- **No external payment** processing required
- **Order confirmation** via email

## 📧 Email Service

### Email Templates
- **Order confirmation** emails
- **Session booking** confirmations
- **Partner application** notifications
- **Admin notifications** for new orders/sessions

### SMTP Configuration
- **Gmail SMTP** support
- **App password** authentication
- **HTML email templates** with styling
- **Error handling** and logging

## 🔒 Security Features

### API Security
- **Helmet.js** for security headers
- **Rate limiting** to prevent abuse
- **CORS configuration** using NEXT_PUBLIC_BACKEND_URL
- **Input validation** and sanitization

### Data Protection
- **Password hashing** with bcrypt
- **JWT token** encryption
- **Session security** with secure cookies
- **Environment variable** protection

### Authentication Middleware
- **JWT verification** for protected routes
- **Admin role** checking
- **Optional authentication** for public routes
- **Automatic token** refresh handling

## 🧪 Development

### Available Scripts
```bash
# Development
npm run dev          # Start with nodemon
npm start            # Start production server
npm test             # Run tests
npm run migrate      # Run database migrations
```

### Code Quality
- **ESLint** configuration for code standards
- **Prettier** formatting (if configured)
- **TypeScript** support (if configured)
- **Git hooks** for pre-commit checks

### API Testing
- **Postman** collection available
- **Health check** endpoint: `GET /api/health`
- **Error handling** with detailed messages
- **Request/response** logging

## 📊 Database Schema

### Core Tables
- **users** - User accounts and profiles
- **products** - Product catalog
- **categories** - Product categories
- **orders** - Customer orders
- **order_items** - Order line items
- **sessions** - Physiotherapy sessions
- **partners** - Partner applications
- **testimonials** - Customer reviews

### Key Relationships
- **User-Orders** - One-to-many
- **Product-Category** - Many-to-one
- **Order-Items** - One-to-many
- **User-Sessions** - One-to-many

## 🚀 Performance

### Database Optimization
- **Indexed queries** for fast lookups
- **Connection pooling** with pg
- **Query optimization** for complex joins
- **Efficient pagination** for large datasets

### API Optimization
- **Response caching** strategies
- **Request validation** before processing
- **Error handling** with minimal overhead
- **Async/await** for non-blocking operations

## 🌐 Deployment

### Production Build
```bash
# Install production dependencies
npm install --production

# Set environment variables
export NODE_ENV=production

# Start server
npm start
```

### Environment Setup
- **Production database** configuration
- **HTTPS** certificate setup
- **Environment variables** for production
- **Monitoring** and logging setup

### Deployment Platforms
- **Heroku** - Easy deployment
- **AWS EC2** - Scalable hosting
- **DigitalOcean** - VPS hosting
- **Docker** - Containerized deployment

## 🐛 Troubleshooting

### Common Issues

#### Database Connection
1. Check PostgreSQL service is running
2. Verify database credentials in `.env`
3. Ensure database exists and is accessible
4. Check firewall/network settings

#### Authentication Issues
1. Verify JWT_SECRET is set
2. Check token expiration settings
3. Ensure CORS is configured correctly
4. Verify Google OAuth credentials

#### Payment Processing
1. Check payment gateway credentials
2. Verify webhook endpoints
3. Check payment service logs
4. Ensure proper error handling

### Debug Mode
Enable debug logging in `.env`:
```bash
NODE_ENV=development
DEBUG=ergiva:*
```

### Logs
- **Console logging** for development
- **Error logging** with stack traces
- **Request/response** logging
- **Database query** logging

## 📚 API Documentation

### Request/Response Format
```json
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

### Authentication Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Rate Limiting
- **100 requests** per 15 minutes per IP
- **Custom limits** for specific endpoints
- **Rate limit headers** in responses

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes and test
4. Submit pull request
5. Code review and merge

### Code Standards
- Follow Node.js best practices
- Use async/await for database operations
- Implement proper error handling
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or questions:
- **Email**: support@ergiva.com
- **Phone**: +91-98765-43210
- **Documentation**: Check frontend README

---

**Built with ❤️ for better healthcare delivery**
