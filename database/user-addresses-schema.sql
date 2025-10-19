-- User Addresses Schema for Food Delivery System
-- This allows users to save multiple delivery addresses

-- Create user_addresses table
CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(100) NOT NULL, -- e.g., "บ้าน", "ที่ทำงาน", "คอนโด"
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  district VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(10),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  phone VARCHAR(20),
  recipient_name VARCHAR(100),
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_default ON user_addresses(user_id, is_default);
CREATE INDEX IF NOT EXISTS idx_user_addresses_location ON user_addresses(latitude, longitude);

-- Create function to ensure only one default address per user
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting this address as default, unset all other defaults for this user
    IF NEW.is_default = true THEN
        UPDATE user_addresses 
        SET is_default = false 
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;
    
    -- If this is the first address for the user, make it default
    IF NOT EXISTS (SELECT 1 FROM user_addresses WHERE user_id = NEW.user_id AND id != NEW.id) THEN
        NEW.is_default = true;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for default address management
DROP TRIGGER IF EXISTS trigger_ensure_single_default_address ON user_addresses;
CREATE TRIGGER trigger_ensure_single_default_address
    BEFORE INSERT OR UPDATE ON user_addresses
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_default_address();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_addresses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_addresses_updated_at ON user_addresses;
CREATE TRIGGER update_user_addresses_updated_at
    BEFORE UPDATE ON user_addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_user_addresses_updated_at();

-- Add delivery_address_id to orders table to link with saved addresses
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address_id UUID REFERENCES user_addresses(id) ON DELETE SET NULL;

-- Create index for orders delivery address
CREATE INDEX IF NOT EXISTS idx_orders_delivery_address ON orders(delivery_address_id);