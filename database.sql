-- Ergiva Healthcare Platform Database Schema
-- PostgreSQL Database Setup

-- Create database (run this separately if needed)
-- CREATE DATABASE ergiva_db;

-- Use the database
-- \c ergiva_db;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    profile_picture VARCHAR(500),
    phone VARCHAR(20),
    address TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id UUID REFERENCES categories(id),
    image_urls TEXT[], -- Array of image URLs
    stock_quantity INTEGER DEFAULT 0,
    features TEXT[], -- Array of product features
    specifications JSONB, -- JSON object for technical specs
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
    payment_method VARCHAR(50), -- razorpay, pay_on_visit
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    shipping_address JSONB,
    order_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Physiotherapy sessions booking
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    contact VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    condition_description TEXT,
    preferred_time TIMESTAMP,
    session_type VARCHAR(100), -- home_visit, online_consultation
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    payment_method VARCHAR(50), -- razorpay, pay_on_visit
    payment_status VARCHAR(50) DEFAULT 'pending',
    amount DECIMAL(10,2),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    assigned_physio_id UUID,
    session_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partner physiotherapists applications
CREATE TABLE partner_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    years_experience INTEGER NOT NULL,
    preferred_area VARCHAR(255),
    additional_info TEXT,
    resume_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials table
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    image_url VARCHAR(500),
    video_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin activity logs
CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX idx_testimonials_active ON testimonials(is_active);

-- Insert default categories
INSERT INTO categories (name, description) VALUES 
('TENS Units', 'Transcutaneous Electrical Nerve Stimulation devices for pain relief'),
('Hot/Cold Therapy', 'Heat pads, ice packs, and temperature therapy products'),
('Resistance Bands', 'Exercise bands for strength training and rehabilitation'),
('Ortho Supports', 'Orthopedic supports, braces, and posture correction devices');

-- Insert sample admin user (password should be hashed in real implementation)
INSERT INTO users (email, name, is_admin) VALUES 
('admin@ergiva.com', 'Ergiva Admin', TRUE);

-- Insert sample products
INSERT INTO products (name, description, price, category_id, image_urls, stock_quantity, features) 
SELECT 
    'TENS Machine Pro',
    'Professional grade TENS unit for effective pain management',
    2999.00,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'],
    50,
    ARRAY['Dual channel output', 'LCD display', 'Multiple therapy modes', '2-year warranty']
FROM categories c WHERE c.name = 'TENS Units';

INSERT INTO products (name, description, price, category_id, image_urls, stock_quantity, features) 
SELECT 
    'Hot & Cold Pack',
    'Reusable gel pack for hot and cold therapy',
    299.00,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
    100,
    ARRAY['Reusable gel formula', 'Flexible design', 'Safe for microwave and freezer']
FROM categories c WHERE c.name = 'Hot/Cold Therapy';

INSERT INTO products (name, description, price, category_id, image_urls, stock_quantity, features) 
SELECT 
    'Resistance Band Set',
    'Complete set of resistance bands for home workouts',
    599.00,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
    75,
    ARRAY['5 resistance levels', 'Door anchor included', 'Exercise guide included']
FROM categories c WHERE c.name = 'Resistance Bands';

INSERT INTO products (name, description, price, category_id, image_urls, stock_quantity, features) 
SELECT 
    'Lumbar Support Belt',
    'Ergonomic lumbar support for back pain relief',
    899.00,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'],
    60,
    ARRAY['Adjustable sizing', 'Breathable material', 'Posture correction']
FROM categories c WHERE c.name = 'Ortho Supports';

-- Insert sample testimonials
INSERT INTO testimonials (name, content, rating, image_url, is_featured) VALUES 
('Priya Sharma', 'Excellent physiotherapy service at home. The therapist was very professional and helped me recover from my back pain quickly.', 5, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400', TRUE),
('Rajesh Kumar', 'Great products and timely delivery. The TENS machine really helped with my chronic pain management.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', TRUE),
('Anita Verma', 'Professional service and caring staff. Highly recommended for anyone needing physiotherapy at home.', 5, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', TRUE);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partner_applications_updated_at BEFORE UPDATE ON partner_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();