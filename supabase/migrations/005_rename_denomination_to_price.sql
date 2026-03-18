-- Rename denomination column to price in products table
ALTER TABLE products RENAME COLUMN denomination TO price;

-- Also rename denomination column in order_items table
ALTER TABLE order_items RENAME COLUMN denomination TO price;
