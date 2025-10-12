-- Promote user to admin role for testing
-- Run this in Supabase SQL Editor after creating a user account

-- Update the user with email 'realadmin@test.com' to admin role
UPDATE users 
SET role = 'admin' 
WHERE email = 'realadmin@test.com';

-- Verify the update
SELECT id, email, name, role, created_at 
FROM users 
WHERE email = 'realadmin@test.com';

-- Show all users and their roles
SELECT email, name, role, is_active, created_at 
FROM users 
ORDER BY created_at DESC;