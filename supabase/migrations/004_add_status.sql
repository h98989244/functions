-- Add status column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

-- Set all existing products to active
UPDATE products SET status = 'active' WHERE status IS NULL OR status = '';
