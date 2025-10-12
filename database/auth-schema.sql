-- Authentication Schema for Food Delivery System
-- Add this to your existing database

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add user_id to orders table (optional - for linking orders to users)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Insert default admin user (password: admin123)
-- Note: In production, use proper password hashing
INSERT INTO users (email, password_hash, name, phone, role) VALUES
('admin@fooddelivery.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQq', 'Admin User', '02-000-0000', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();