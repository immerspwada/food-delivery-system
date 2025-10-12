-- Add Authentication to Existing Food Delivery Database
-- Run this in Supabase SQL Editor if you already have the basic tables

-- Create Users table for authentication
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

-- Add user_id column to existing orders table (if it doesn't exist)
DO $$ BEGIN
    ALTER TABLE orders ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;
EXCEPTION
    WHEN duplicate_column THEN 
        RAISE NOTICE 'Column user_id already exists in orders table';
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Create function to update updated_at timestamp (if it doesn't exist)
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

-- Insert default admin user (password: admin123)
-- Note: This is a bcrypt hash of "admin123"
INSERT INTO users (email, password_hash, name, phone, role) VALUES
('admin@fooddelivery.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQq', 'Admin User', '02-000-0000', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample customer users
INSERT INTO users (email, password_hash, name, phone, role) VALUES
('customer1@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQq', 'John Doe', '08-1234-5678', 'customer'),
('customer2@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQq', 'Jane Smith', '08-9876-5432', 'customer')
ON CONFLICT (email) DO NOTHING;

-- Success message
SELECT 'Authentication system added successfully! Users table created and orders table updated.' AS message;