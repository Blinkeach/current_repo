-- =====================================================
-- MIGRATION: Change order ID from INTEGER to BIGINT
-- This fixes the "value out of range for type integer" error
-- =====================================================

-- Step 1: Drop foreign key constraints that reference orders.id
ALTER TABLE referral_rewards DROP CONSTRAINT IF EXISTS referral_rewards_order_id_orders_id_fk;

-- Step 2: Change the column types to BIGINT
ALTER TABLE orders ALTER COLUMN id TYPE BIGINT;
ALTER TABLE order_items ALTER COLUMN order_id TYPE BIGINT;
ALTER TABLE return_requests ALTER COLUMN order_id TYPE BIGINT;
ALTER TABLE referral_rewards ALTER COLUMN order_id TYPE BIGINT;

-- Step 3: Recreate the foreign key constraint
ALTER TABLE referral_rewards 
  ADD CONSTRAINT referral_rewards_order_id_orders_id_fk 
  FOREIGN KEY (order_id) REFERENCES orders(id);

-- Verify the changes
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE column_name IN ('id', 'order_id') 
  AND table_name IN ('orders', 'order_items', 'return_requests', 'referral_rewards')
ORDER BY table_name, column_name;