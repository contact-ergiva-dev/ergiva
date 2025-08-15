#!/bin/bash

# Ergiva Setup Script
echo "🏥 Setting up Ergiva Healthcare Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js $(node -v) is installed"

# Check if PostgreSQL is available
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL not found. Please install PostgreSQL and create a database."
    print_info "You can install PostgreSQL from: https://www.postgresql.org/download/"
fi

# Install root dependencies
print_info "Installing root dependencies..."
npm install

# Install frontend dependencies
print_info "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
print_info "Installing backend dependencies..."
cd backend
npm install
cd ..

print_status "All dependencies installed successfully!"

# Copy environment files
print_info "Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    print_warning "Created backend/.env from example. Please update with your credentials."
else
    print_info "Backend .env file already exists"
fi

if [ ! -f "frontend/.env.local" ]; then
    cp frontend/env.example frontend/.env.local
    print_warning "Created frontend/.env.local from example. Please update with your credentials."
else
    print_info "Frontend .env.local file already exists"
fi

# Create uploads directory
mkdir -p backend/uploads
print_status "Created uploads directory"

# Setup database (if PostgreSQL is available)
if command -v psql &> /dev/null; then
    print_info "Setting up database..."
    
    # Check if database exists
    if psql -lqt | cut -d \| -f 1 | grep -qw ergiva_db; then
        print_info "Database 'ergiva_db' already exists"
    else
        print_warning "Please create the database manually:"
        echo "  createdb ergiva_db"
        echo "  psql -d ergiva_db -f database.sql"
    fi
else
    print_warning "PostgreSQL not available. Please set up the database manually."
fi

# Create necessary directories
mkdir -p frontend/public/images
mkdir -p frontend/public/videos
mkdir -p backend/uploads

print_status "Directory structure created"

# Print next steps
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Configure Environment Variables:"
echo "   - Edit backend/.env with your database, Google OAuth, Razorpay, and email credentials"
echo "   - Edit frontend/.env.local with your API endpoints and client IDs"
echo ""
echo "2. Set up Database:"
echo "   - Create PostgreSQL database: createdb ergiva_db"
echo "   - Run schema: psql -d ergiva_db -f database.sql"
echo ""
echo "3. Get Required Credentials:"
echo "   - Google OAuth: https://console.cloud.google.com/"
echo "   - Razorpay: https://razorpay.com/"
echo "   - Gmail App Password: Google Account > Security > App passwords"
echo ""
echo "4. Start Development:"
echo "   - npm run dev (runs both frontend and backend)"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend: http://localhost:5000"
echo "   - Admin: http://localhost:3000/admin"
echo ""
echo "5. Default Admin Login:"
echo "   - Email: admin@ergiva.com"
echo "   - Password: admin123"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Complete setup and deployment guide"
echo "   - database.sql - Database schema and sample data"
echo "   - sample-assets/ - Placeholder assets and guidelines"
echo ""
echo "🆘 Need Help?"
echo "   - Check README.md for detailed instructions"
echo "   - Review environment variable examples"
echo "   - Ensure all services are running"
echo ""
print_status "Happy coding! 🚀"