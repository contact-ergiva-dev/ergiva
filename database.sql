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
    password_hash VARCHAR(255),
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

-- Insert sample admin user with password hash (password: 'admin123')
INSERT INTO users (email, name, password_hash, is_admin) VALUES 
('admin@ergiva.com', 'Ergiva Admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

-- Insert sample products with better images and descriptions
INSERT INTO products (name, description, price, category_id, image_urls, stock_quantity, features) 
SELECT 
    'TENS Machine Pro',
    'Professional grade TENS unit for effective pain management. Features dual channel output with adjustable intensity levels.',
    2999.00,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
    50,
    ARRAY['Dual channel output', 'LCD display', 'Multiple therapy modes', '2-year warranty', 'Rechargeable battery']
FROM categories c WHERE c.name = 'TENS Units';

INSERT INTO products (name, description, price, category_id, image_urls, stock_quantity, features) 
SELECT 
    'Hot & Cold Pack',
    'Reusable gel pack for hot and cold therapy. Perfect for muscle pain relief and injury recovery.',
    299.00,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'],
    100,
    ARRAY['Reusable gel formula', 'Flexible design', 'Safe for microwave and freezer', 'Multiple sizes available']
FROM categories c WHERE c.name = 'Hot/Cold Therapy';

INSERT INTO products (name, description, price, category_id, image_urls, stock_quantity, features) 
SELECT 
    'Resistance Band Set',
    'Complete set of resistance bands for home workouts and rehabilitation exercises.',
    599.00,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'],
    75,
    ARRAY['5 resistance levels', 'Door anchor included', 'Exercise guide included', 'Travel-friendly']
FROM categories c WHERE c.name = 'Resistance Bands';

INSERT INTO products (name, description, price, category_id, image_urls, stock_quantity, features) 
SELECT 
    'Lumbar Support Belt',
    'Ergonomic lumbar support for back pain relief and posture correction.',
    899.00,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
    60,
    ARRAY['Adjustable sizing', 'Breathable material', 'Posture correction', 'Medical grade']
FROM categories c WHERE c.name = 'Ortho Supports';

-- Add more products
INSERT INTO products (name, description, price, category_id, image_urls, stock_quantity, features) 
SELECT 
    'TENS Unit Deluxe',
    'Advanced TENS unit with 20 pre-programmed modes and wireless remote control.',
    3999.00,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'],
    30,
    ARRAY['20 therapy modes', 'Wireless remote', 'Bluetooth connectivity', '3-year warranty']
FROM categories c WHERE c.name = 'TENS Units';

INSERT INTO products (name, description, price, category_id, image_urls, stock_quantity, features) 
SELECT 
    'Electric Heating Pad',
    'Large electric heating pad with auto-shutoff and multiple heat settings.',
    799.00,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
    80,
    ARRAY['Auto-shutoff', '6 heat settings', 'Machine washable', 'Large size']
FROM categories c WHERE c.name = 'Hot/Cold Therapy';

INSERT INTO products (name, description, price, category_id, image_urls, stock_quantity, features) 
SELECT 
    'Premium Resistance Bands',
    'Professional grade resistance bands with handles and ankle straps.',
    899.00,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
    45,
    ARRAY['Professional grade', 'Includes handles', 'Ankle straps', 'Exercise manual']
FROM categories c WHERE c.name = 'Resistance Bands';

INSERT INTO products (name, description, price, category_id, image_urls, stock_quantity, features) 
SELECT 
    'Cervical Collar',
    'Soft cervical collar for neck support and pain relief.',
    499.00,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'],
    70,
    ARRAY['Soft material', 'Adjustable fit', 'Breathable', 'Medical grade']
FROM categories c WHERE c.name = 'Ortho Supports';

INSERT INTO products (name, description, price, category_id, image_urls, stock_quantity, features) 
SELECT 
    'Knee Support Brace',
    'Adjustable knee brace for support and pain relief during activities.',
    699.00,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
    55,
    ARRAY['Adjustable straps', 'Breathable mesh', 'Silicone grip', 'Universal fit']
FROM categories c WHERE c.name = 'Ortho Supports';

INSERT INTO products (name, description, price, category_id, image_urls, stock_quantity, features) 
SELECT 
    'Ice Pack Set',
    'Set of 4 reusable ice packs in different sizes for various body areas.',
    399.00,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
    90,
    ARRAY['4 different sizes', 'Reusable', 'Long-lasting cold', 'Flexible design']
FROM categories c WHERE c.name = 'Hot/Cold Therapy';

-- Insert sample testimonials with more realistic data
INSERT INTO testimonials (name, content, rating, image_url, is_featured) VALUES 
('Priya Sharma', 'Excellent physiotherapy service at home. The therapist was very professional and helped me recover from my back pain quickly. The TENS machine they recommended works wonders!', 5, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400', TRUE),
('Rajesh Kumar', 'Great products and timely delivery. The TENS machine really helped with my chronic pain management. Customer service is outstanding.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', TRUE),
('Anita Verma', 'Professional service and caring staff. Highly recommended for anyone needing physiotherapy at home. The resistance bands are perfect for my daily exercises.', 5, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', TRUE),
('Dr. Meera Patel', 'As a physiotherapist, I highly recommend Ergiva products. The quality is excellent and they have a great range for different therapy needs.', 5, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', TRUE),
('Suresh Reddy', 'The home physiotherapy service is amazing. The therapist was punctual, professional, and helped me recover from my knee surgery faster than expected.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', FALSE),
('Kavita Singh', 'I love the hot/cold therapy pack. It''s been a lifesaver for my shoulder pain. The service is reliable and the products are of high quality.', 4, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400', FALSE),
('Amit Gupta', 'The lumbar support belt has significantly improved my posture and reduced my back pain. Great product and excellent customer support.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', FALSE),
('Sunita Desai', 'My physiotherapy sessions at home have been wonderful. The therapist is very knowledgeable and the exercises have helped me regain strength after my accident.', 5, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', FALSE),
('Vikram Malhotra', 'The TENS unit is fantastic for pain relief. Easy to use and very effective. The delivery was quick and the staff was helpful with setup instructions.', 4, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', FALSE),
('Rekha Iyer', 'I''ve been using Ergiva products for 6 months now. The quality is consistent and the customer service is exceptional. Highly recommend!', 5, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400', FALSE);

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

-- Insert sample physiotherapy sessions
INSERT INTO sessions (user_id, name, age, contact, email, address, condition_description, preferred_time, session_type, status, payment_method, payment_status, amount, assigned_physio_id, session_notes) 
SELECT 
    u.id,
    'Rahul Sharma',
    35,
    '+91-9876543210',
    'rahul.sharma@email.com',
    '123, Green Park, New Delhi - 110016',
    'Lower back pain due to prolonged sitting at work. Needs strengthening exercises and pain management.',
    CURRENT_TIMESTAMP + INTERVAL '2 days',
    'home_visit',
    'confirmed',
    'razorpay',
    'completed',
    1500.00,
    NULL,
    'Patient prefers morning sessions. Has history of back issues.'
FROM users u WHERE u.email = 'admin@ergiva.com';

INSERT INTO sessions (user_id, name, age, contact, email, address, condition_description, preferred_time, session_type, status, payment_method, payment_status, amount, assigned_physio_id, session_notes) 
SELECT 
    u.id,
    'Meera Kapoor',
    28,
    '+91-8765432109',
    'meera.kapoor@email.com',
    '456, Defence Colony, New Delhi - 110024',
    'Post-surgery rehabilitation for ACL reconstruction. Needs progressive strengthening program.',
    CURRENT_TIMESTAMP + INTERVAL '1 day',
    'home_visit',
    'pending',
    'pay_on_visit',
    'pending',
    2000.00,
    NULL,
    'Surgery was 3 weeks ago. Patient is motivated and follows instructions well.'
FROM users u WHERE u.email = 'admin@ergiva.com';

INSERT INTO sessions (user_id, name, age, contact, email, address, condition_description, preferred_time, session_type, status, payment_method, payment_status, amount, assigned_physio_id, session_notes) 
SELECT 
    u.id,
    'Arjun Singh',
    42,
    '+91-7654321098',
    'arjun.singh@email.com',
    '789, Vasant Vihar, New Delhi - 110057',
    'Frozen shoulder with limited range of motion. Needs mobilization and stretching exercises.',
    CURRENT_TIMESTAMP + INTERVAL '3 days',
    'online_consultation',
    'confirmed',
    'razorpay',
    'completed',
    1200.00,
    NULL,
    'Patient has been experiencing symptoms for 4 months. Prefers online sessions due to work schedule.'
FROM users u WHERE u.email = 'admin@ergiva.com';

INSERT INTO sessions (user_id, name, age, contact, email, address, condition_description, preferred_time, session_type, status, payment_method, payment_status, amount, assigned_physio_id, session_notes) 
SELECT 
    u.id,
    'Priya Patel',
    31,
    '+91-6543210987',
    'priya.patel@email.com',
    '321, Greater Kailash, New Delhi - 110048',
    'Neck pain and stiffness due to poor posture and stress. Needs ergonomic advice and exercises.',
    CURRENT_TIMESTAMP + INTERVAL '5 days',
    'home_visit',
    'pending',
    'razorpay',
    'pending',
    1800.00,
    NULL,
    'Works long hours on computer. Needs posture correction and stress management techniques.'
FROM users u WHERE u.email = 'admin@ergiva.com';

INSERT INTO sessions (user_id, name, age, contact, email, address, condition_description, preferred_time, session_type, status, payment_method, payment_status, amount, assigned_physio_id, session_notes) 
SELECT 
    u.id,
    'Vikram Malhotra',
    55,
    '+91-5432109876',
    'vikram.malhotra@email.com',
    '654, South Extension, New Delhi - 110049',
    'Osteoarthritis in both knees. Needs pain management and mobility improvement.',
    CURRENT_TIMESTAMP + INTERVAL '1 week',
    'home_visit',
    'completed',
    'pay_on_visit',
    'completed',
    2500.00,
    NULL,
    'Patient has been managing well with the exercises. Significant improvement in mobility noted.'
FROM users u WHERE u.email = 'admin@ergiva.com';

-- Insert sample partner applications (physiotherapists)
INSERT INTO partner_applications (name, mobile, email, qualification, years_experience, preferred_area, additional_info, status, review_notes) VALUES 
('Dr. Anjali Sharma', '+91-9876543211', 'anjali.sharma@email.com', 'MPT in Orthopedics', 8, 'South Delhi, Gurgaon', 'Specialized in sports injuries and post-surgery rehabilitation. Available for home visits and online consultations.', 'approved', 'Excellent qualifications and experience. Approved for partnership.'),
('Dr. Rajesh Kumar', '+91-8765432101', 'rajesh.kumar@email.com', 'BPT with Sports Certification', 5, 'North Delhi, Noida', 'Experienced in treating sports injuries and musculoskeletal conditions. Flexible with timing.', 'pending', 'Good profile, needs to be reviewed further.'),
('Dr. Sneha Verma', '+91-7654321091', 'sneha.verma@email.com', 'MPT in Neurology', 6, 'East Delhi, Faridabad', 'Specialized in neurological rehabilitation and stroke recovery. Available for home visits.', 'approved', 'Strong background in neurology. Approved for partnership.'),
('Dr. Amit Singh', '+91-6543210981', 'amit.singh@email.com', 'BPT with Geriatric Certification', 4, 'West Delhi, Dwarka', 'Experienced in geriatric care and chronic pain management. Good with elderly patients.', 'pending', 'Good experience with geriatric patients. Under review.'),
('Dr. Kavita Reddy', '+91-5432109871', 'kavita.reddy@email.com', 'MPT in Cardiopulmonary', 7, 'Central Delhi, New Delhi', 'Specialized in cardiac and pulmonary rehabilitation. Available for both home visits and online sessions.', 'approved', 'Excellent specialization in cardiopulmonary care. Approved.'),
('Dr. Manish Gupta', '+91-4321098761', 'manish.gupta@email.com', 'BPT with Pediatric Certification', 3, 'All Delhi areas', 'Experienced in pediatric physiotherapy and developmental disorders. Patient and caring with children.', 'rejected', 'Limited experience in general physiotherapy. Rejected for now.'),
('Dr. Sunita Desai', '+91-3210987651', 'sunita.desai@email.com', 'MPT in Women Health', 9, 'South Delhi, Gurgaon', 'Specialized in women health, pregnancy-related issues, and pelvic floor rehabilitation.', 'approved', 'Excellent specialization and experience. Approved for partnership.'),
('Dr. Ramesh Iyer', '+91-2109876541', 'ramesh.iyer@email.com', 'BPT with Manual Therapy Certification', 6, 'North Delhi, Ghaziabad', 'Experienced in manual therapy techniques and chronic pain management. Good communication skills.', 'pending', 'Good skills in manual therapy. Under review.');

-- Insert sample orders
INSERT INTO orders (user_id, total_amount, status, payment_method, payment_status, shipping_address, order_notes) 
SELECT 
    u.id,
    3298.00,
    'delivered',
    'razorpay',
    'completed',
    '{"name": "Rahul Sharma", "address": "123, Green Park, New Delhi - 110016", "city": "New Delhi", "state": "Delhi", "pincode": "110016", "phone": "+91-9876543210"}',
    'Customer requested morning delivery'
FROM users u WHERE u.email = 'admin@ergiva.com';

INSERT INTO orders (user_id, total_amount, status, payment_method, payment_status, shipping_address, order_notes) 
SELECT 
    u.id,
    1598.00,
    'shipped',
    'razorpay',
    'completed',
    '{"name": "Meera Kapoor", "address": "456, Defence Colony, New Delhi - 110024", "city": "New Delhi", "state": "Delhi", "pincode": "110024", "phone": "+91-8765432109"}',
    'Gift wrapped as requested'
FROM users u WHERE u.email = 'admin@ergiva.com';

INSERT INTO orders (user_id, total_amount, status, payment_method, payment_status, shipping_address, order_notes) 
SELECT 
    u.id,
    4598.00,
    'confirmed',
    'pay_on_visit',
    'pending',
    '{"name": "Arjun Singh", "address": "789, Vasant Vihar, New Delhi - 110057", "city": "New Delhi", "state": "Delhi", "pincode": "110057", "phone": "+91-7654321098"}',
    'Customer prefers COD'
FROM users u WHERE u.email = 'admin@ergiva.com';

INSERT INTO orders (user_id, total_amount, status, payment_method, payment_status, shipping_address, order_notes) 
SELECT 
    u.id,
    898.00,
    'pending',
    'razorpay',
    'pending',
    '{"name": "Priya Patel", "address": "321, Greater Kailash, New Delhi - 110048", "city": "New Delhi", "state": "Delhi", "pincode": "110048", "phone": "+91-6543210987"}',
    NULL
FROM users u WHERE u.email = 'admin@ergiva.com';

-- Insert order items for the first order
INSERT INTO order_items (order_id, product_id, quantity, price) 
SELECT 
    o.id,
    p.id,
    1,
    2999.00
FROM orders o, products p 
WHERE o.total_amount = 3298.00 AND p.name = 'TENS Machine Pro';

INSERT INTO order_items (order_id, product_id, quantity, price) 
SELECT 
    o.id,
    p.id,
    1,
    299.00
FROM orders o, products p 
WHERE o.total_amount = 3298.00 AND p.name = 'Hot & Cold Pack';

-- Insert order items for the second order
INSERT INTO order_items (order_id, product_id, quantity, price) 
SELECT 
    o.id,
    p.id,
    1,
    599.00
FROM orders o, products p 
WHERE o.total_amount = 1598.00 AND p.name = 'Resistance Band Set';

INSERT INTO order_items (order_id, product_id, quantity, price) 
SELECT 
    o.id,
    p.id,
    1,
    999.00
FROM orders o, products p 
WHERE o.total_amount = 1598.00 AND p.name = 'Premium Resistance Bands';

-- Insert order items for the third order
INSERT INTO order_items (order_id, product_id, quantity, price) 
SELECT 
    o.id,
    p.id,
    1,
    3999.00
FROM orders o, products p 
WHERE o.total_amount = 4598.00 AND p.name = 'TENS Unit Deluxe';

INSERT INTO order_items (order_id, product_id, quantity, price) 
SELECT 
    o.id,
    p.id,
    1,
    599.00
FROM orders o, products p 
WHERE o.total_amount = 4598.00 AND p.name = 'Resistance Band Set';

-- Insert order items for the fourth order
INSERT INTO order_items (order_id, product_id, quantity, price) 
SELECT 
    o.id,
    p.id,
    1,
    898.00
FROM orders o, products p 
WHERE o.total_amount = 898.00 AND p.name = 'Lumbar Support Belt';