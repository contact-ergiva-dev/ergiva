# 🏥 Ergiva - Full-Stack Healthcare Platform

A complete, responsive full-stack website for **Ergiva**, a Delhi NCR-based brand offering **home physiotherapy services** and **physiotherapy products** (TENS machines, hot/cold packs, resistance bands, ortho supports).

## ✨ Features

### 🎯 Core Functionality
- **Home Physiotherapy Booking**: Book qualified physiotherapists for home visits
- **Product E-commerce**: Shop for physiotherapy equipment and products
- **Google OAuth Authentication**: Secure user login with Google Sign-In
- **Payment Integration**: Razorpay payments + "Pay on Visit" option
- **Admin Panel**: Comprehensive admin dashboard for managing orders, sessions, and products
- **Email Notifications**: Automated confirmation emails via Nodemailer
- **WhatsApp Integration**: Floating WhatsApp chat widget
- **Responsive Design**: Mobile-first design with Tailwind CSS

### 📄 Pages Included
1. **Home Page** - Hero section, about, featured products, testimonials
2. **Shop Page** - Product catalog with categories and cart functionality
3. **Book Session Page** - Physiotherapy session booking form
4. **About Us Page** - Company information and mission
5. **Join as Partner Page** - Partner physiotherapist application form
6. **Admin Panel** - Complete admin dashboard (`/admin`)

### 🔧 Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: Google OAuth + JWT
- **Payments**: Razorpay
- **Email**: Nodemailer
- **Deployment Ready**: Hostinger, Vercel + Railway configurations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials
- Razorpay account (for payments)
- Gmail account (for email service)

### 1. Clone and Install

```bash
git clone <repository-url>
cd ergiva

# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install:all
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb ergiva_db

# Run the database schema
psql -d ergiva_db -f database.sql
```

### 3. Environment Configuration

#### Backend (.env)
```bash
cd backend
cp env.example .env
```

Edit `backend/.env` with your credentials:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ergiva_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-super-secret-session-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Razorpay Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Admin Configuration
ADMIN_EMAIL=admin@ergiva.com
ADMIN_PASSWORD=admin123
```

#### Frontend (.env.local)
```bash
cd frontend
cp env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
NEXT_PUBLIC_WHATSAPP_NUMBER=+919211215116
NEXT_PUBLIC_TAWK_TO_ID=your-tawk-to-property-id (optional)
```

### 4. Run the Application

```bash
# From root directory - runs both frontend and backend
npm run dev

# Or run separately:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:5000
```

## 🔑 Getting Required Credentials

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)

### Razorpay Setup
1. Sign up at [Razorpay](https://razorpay.com/)
2. Get API keys from Dashboard > Settings > API Keys
3. For testing, use test mode keys

### Gmail SMTP Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Google Account > Security > 2-Step Verification > App Passwords
3. Use the generated password in EMAIL_PASS

## 📊 Admin Panel

Access the admin panel at `/admin` with:
- **Email**: admin@ergiva.com
- **Password**: admin123

### Admin Features
- Dashboard with analytics
- Manage products (CRUD operations)
- View and manage orders
- View and manage physiotherapy sessions
- Review partner applications
- Manage testimonials
- User management
- System health monitoring

## 🏗️ Database Schema

The application includes comprehensive database schema with:

- **Users** - User accounts and authentication
- **Products** - Product catalog with categories
- **Orders** - E-commerce order management
- **Sessions** - Physiotherapy session bookings
- **Partner Applications** - Physiotherapist partner applications
- **Testimonials** - Customer testimonials
- **Admin Logs** - Activity logging

Sample data is included for testing.

## 📧 Email Templates

Professional email templates included for:
- Order confirmations
- Session booking confirmations
- Partner application status updates
- Admin notifications

## 🌐 Deployment

### Option 1: Hostinger (Full-Stack)

1. **Purchase Hostinger hosting** with Node.js support
2. **Upload files** to your hosting directory
3. **Set up PostgreSQL database** in Hostinger panel
4. **Configure environment variables** in hosting panel
5. **Install dependencies** via SSH:
   ```bash
   npm install
   cd frontend && npm install && npm run build
   cd ../backend && npm install
   ```
6. **Start the application**:
   ```bash
   npm start
   ```

### Option 2: Vercel + Railway

#### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically

#### Backend (Railway)
1. Connect your GitHub repo to Railway
2. Add PostgreSQL service in Railway
3. Set environment variables in Railway dashboard
4. Deploy backend service

### Option 3: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🔧 Configuration Files Included

- `package.json` - Root package with scripts
- `frontend/package.json` - Frontend dependencies
- `backend/package.json` - Backend dependencies
- `database.sql` - Complete database schema
- `docker-compose.yml` - Docker configuration
- Environment examples for all services

## 📱 Features Breakdown

### Frontend Features
- ✅ Responsive design (mobile-first)
- ✅ Google OAuth integration
- ✅ Shopping cart functionality
- ✅ Razorpay payment integration
- ✅ WhatsApp floating widget
- ✅ SEO optimized
- ✅ Progressive Web App ready
- ✅ Accessibility compliant

### Backend Features
- ✅ RESTful API architecture
- ✅ JWT authentication
- ✅ Input validation
- ✅ Error handling
- ✅ Rate limiting
- ✅ Security headers
- ✅ Email service
- ✅ Payment processing
- ✅ Admin panel APIs

### Database Features
- ✅ Normalized schema design
- ✅ Indexing for performance
- ✅ Data validation
- ✅ Audit logging
- ✅ Sample data included
- ✅ Migration scripts

## 🛡️ Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- SQL injection prevention
- XSS protection
- CSRF protection

## 📞 Support & Contact

- **Phone**: +91 92112 15116
- **Email**: support@ergiva.com
- **Hours**: 9 AM - 9 PM (Mon-Sun)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for Ergiva Healthcare Platform**# ergiva
