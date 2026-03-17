-- ============================================================
-- 002_single_denomination.sql  --  One product per denomination
-- ============================================================

-- Add new columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS denomination int4 DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url text;

-- Drop old array columns
ALTER TABLE products DROP COLUMN IF EXISTS denominations;
ALTER TABLE products DROP COLUMN IF EXISTS images;
