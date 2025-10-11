-- Fix the misspelled table name from product_varients to product_variants
-- Run this SQL script in your PostgreSQL database

-- Rename the table
ALTER TABLE product_varients RENAME TO product_variants;

-- Verify the rename was successful
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'product_variants';