# 🚀 Deployment Guide for Ergiva Healthcare Platform

This guide covers different deployment options for the Ergiva platform.

## 📋 Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] All environment variables configured
- [ ] Database schema deployed
- [ ] Google OAuth configured with production URLs
- [ ] Razorpay keys updated for production
- [ ] Email service configured
- [ ] SSL certificates obtained (for HTTPS)
- [ ] Domain configured and DNS updated

### ✅ Code Preparation
- [ ] All features tested locally
- [ ] Frontend build successful (`npm run build`)
- [ ] Backend tests passing
- [ ] Database migrations completed
- [ ] Assets optimized and uploaded
- [ ] Error handling implemented
- [ ] Security headers configured

### ✅ Performance & Security
- [ ] Images optimized (WebP format)
- [ ] CDN configured for static assets
- [ ] Rate limiting configured
- [ ] CORS properly set up
- [ ] SQL injection protection enabled
- [ ] XSS protection enabled
- [ ] HTTPS enforced

## 🌐 Deployment Options

### Option 1: Hostinger (Recommended for Full-Stack)

Hostinger provides Node.js hosting with PostgreSQL support.

#### Step 1: Prepare Files
```bash
# Build frontend
cd frontend
npm run build
cd ..

# Create deployment package
tar -czf ergiva-deployment.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=frontend/.next \
  .
```

#### Step 2: Upload to Hostinger
1. Login to Hostinger control panel
2. Go to File Manager
3. Upload and extract the deployment package
4. Set up PostgreSQL database in Hostinger panel

#### Step 3: Install Dependencies
```bash
# Via SSH terminal in Hostinger
npm install
cd frontend && npm install && npm run build
cd ../backend && npm install
```

#### Step 4: Configure Environment Variables
Create production environment files in Hostinger file manager:

**backend/.env**
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
# ... other production variables
```

#### Step 5: Start Application
```bash
# In Hostinger, create startup script
npm start
```

#### Step 6: Configure Domain
- Point your domain to Hostinger nameservers
- Enable SSL in Hostinger panel
- Update Google OAuth redirect URLs

---

### Option 2: Vercel (Frontend) + Railway (Backend)

This option separates frontend and backend for better scalability.

#### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your Git repository
   - Select the `frontend` folder as root directory

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   ```

3. **Environment Variables**
   Add in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
   NEXT_PUBLIC_WHATSAPP_NUMBER=+919211215116
   ```

4. **Deploy**
   - Push to main branch
   - Vercel auto-deploys

#### Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to [Railway](https://railway.app/)
   - Connect your GitHub account

2. **Deploy Backend**
   - Create new project
   - Connect GitHub repository
   - Select `backend` folder

3. **Add PostgreSQL**
   - In Railway dashboard, add PostgreSQL service
   - Note the connection details

4. **Configure Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-vercel-domain.vercel.app
   DATABASE_URL=postgresql://user:pass@host:port/db
   # ... other variables
   ```

5. **Deploy Database Schema**
   ```bash
   # Connect to Railway PostgreSQL and run
   psql $DATABASE_URL -f database.sql
   ```

---

### Option 3: Docker Deployment

Use Docker for consistent deployment across environments.

#### Prerequisites
- Docker and Docker Compose installed
- Domain configured
- SSL certificates

#### Step 1: Configure Environment
Update `docker-compose.yml` with production settings:

```yaml
services:
  postgres:
    environment:
      POSTGRES_DB: ergiva_db
      POSTGRES_USER: your_user
      POSTGRES_PASSWORD: your_secure_password

  backend:
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      FRONTEND_URL: https://yourdomain.com
      # ... other production variables

  frontend:
    environment:
      NEXT_PUBLIC_API_URL: https://yourdomain.com/api
      # ... other production variables
```

#### Step 2: Deploy with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### Step 3: Set up Nginx (Optional)
Configure reverse proxy for better performance:

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:5000;
    }

    server {
        listen 80;
        server_name yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

---

### Option 4: AWS/GCP/Azure

For enterprise-level deployment with auto-scaling.

#### AWS Architecture
- **Frontend**: AWS Amplify or S3 + CloudFront
- **Backend**: ECS or EC2 with Application Load Balancer
- **Database**: RDS PostgreSQL
- **Assets**: S3 bucket
- **CDN**: CloudFront

#### Deployment Steps
1. Set up RDS PostgreSQL instance
2. Deploy backend to ECS/EC2
3. Deploy frontend to Amplify/S3
4. Configure CloudFront distribution
5. Set up Route 53 for domain
6. Configure SSL certificates

---

## 🔧 Post-Deployment Configuration

### 1. Domain & SSL Setup
```bash
# For Let's Encrypt SSL (if not using hosting provider SSL)
sudo certbot --nginx -d yourdomain.com
```

### 2. Database Migration
```sql
-- Connect to production database
psql -h your-db-host -U your-user -d your-db

-- Run migration script
\i database.sql

-- Verify tables created
\dt
```

### 3. Admin Account Setup
```sql
-- Create admin user if not exists
INSERT INTO users (email, name, is_admin) 
VALUES ('admin@yourdomain.com', 'Admin User', TRUE)
ON CONFLICT (email) DO NOTHING;
```

### 4. Google OAuth Configuration
Update OAuth settings in Google Cloud Console:
- **Authorized JavaScript origins**: `https://yourdomain.com`
- **Authorized redirect URIs**: `https://yourdomain.com/api/auth/google/callback`

### 5. Payment Gateway Configuration
Update Razorpay settings:
- Switch to live mode
- Update webhook URLs
- Configure payment methods

### 6. Email Configuration
Test email service:
```bash
# Test email sending
curl -X POST https://yourdomain.com/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com"}'
```

---

## 📊 Monitoring & Maintenance

### Health Checks
Set up monitoring for:
- API endpoint health (`/api/health`)
- Database connectivity
- Email service status
- Payment gateway status

### Backup Strategy
1. **Database Backups**
   ```bash
   # Daily automated backup
   pg_dump -h host -U user dbname > backup-$(date +%Y%m%d).sql
   ```

2. **File Backups**
   - User uploads (`backend/uploads/`)
   - Configuration files
   - SSL certificates

### Performance Monitoring
- Use tools like New Relic, DataDog, or AWS CloudWatch
- Monitor response times
- Track error rates
- Monitor database performance

### Security Updates
- Regularly update dependencies
- Monitor security advisories
- Implement automated security scanning
- Regular penetration testing

---

## 🆘 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check database connection
psql -h host -U user -d dbname

# Check environment variables
echo $DATABASE_URL
```

#### 2. CORS Issues
Ensure CORS is configured properly in backend:
```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

#### 3. SSL Certificate Issues
```bash
# Check certificate validity
openssl x509 -in certificate.crt -text -noout

# Renew Let's Encrypt certificate
sudo certbot renew
```

#### 4. Memory Issues
```bash
# Check memory usage
free -h

# Restart services if needed
docker-compose restart
```

### Logs Location
- **Hostinger**: Check cPanel error logs
- **Railway**: View in Railway dashboard
- **Docker**: `docker-compose logs -f servicename`

---

## 📞 Support

For deployment support:
- Check documentation in README.md
- Review environment configuration
- Test all services individually
- Contact hosting provider support if needed

---

**Deployment completed successfully! 🎉**

Your Ergiva platform should now be live and accessible at your domain.