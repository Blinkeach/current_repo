-- =====================================================
-- BLINKEACH E-COMMERCE DATABASE SEED DATA
-- Complete dataset for all categories and tables
-- =====================================================

-- Clear existing data (in reverse order of dependencies)
TRUNCATE TABLE referral_rewards, wishlist_items, referrals, return_requests, reviews, cart_items, order_items, orders, product_variants, products, categories, user_addresses, users RESTART IDENTITY CASCADE;

-- =====================================================
-- 1. USERS DATA
-- =====================================================
INSERT INTO users (username, password, email, full_name, phone, address, city, state, pincode, is_admin, is_active, email_verified, created_at) VALUES
-- Admin User
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILY8z9H3u', 'admin@blinkeach.com', 'Admin User', '8709144545', '123 Admin Street', 'Mumbai', 'Maharashtra', '400001', true, true, true, NOW()),

-- Regular Customers
('rajesh_kumar', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILY8z9H3u', 'rajesh.kumar@gmail.com', 'Rajesh Kumar', '9876543210', '45 MG Road', 'Bangalore', 'Karnataka', '560001', false, true, true, NOW()),
('priya_sharma', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILY8z9H3u', 'priya.sharma@gmail.com', 'Priya Sharma', '9876543211', '78 Park Street', 'Kolkata', 'West Bengal', '700016', false, true, true, NOW()),
('amit_patel', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILY8z9H3u', 'amit.patel@gmail.com', 'Amit Patel', '9876543212', '12 SG Highway', 'Ahmedabad', 'Gujarat', '380015', false, true, true, NOW()),
('sneha_reddy', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILY8z9H3u', 'sneha.reddy@gmail.com', 'Sneha Reddy', '9876543213', '34 Banjara Hills', 'Hyderabad', 'Telangana', '500034', false, true, true, NOW()),
('vikram_singh', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILY8z9H3u', 'vikram.singh@gmail.com', 'Vikram Singh', '9876543214', '56 Connaught Place', 'New Delhi', 'Delhi', '110001', false, true, true, NOW());

-- Password for all users: "password123"

-- =====================================================
-- 2. USER ADDRESSES
-- =====================================================
INSERT INTO user_addresses (user_id, address_name, full_name, phone, address, city, state, pincode, is_default, created_at) VALUES
(2, 'Home', 'Rajesh Kumar', '9876543210', '45 MG Road', 'Bangalore', 'Karnataka', '560001', true, NOW()),
(2, 'Office', 'Rajesh Kumar', '9876543210', '12 Tech Park, Whitefield', 'Bangalore', 'Karnataka', '560066', false, NOW()),
(3, 'Home', 'Priya Sharma', '9876543211', '78 Park Street', 'Kolkata', 'West Bengal', '700016', true, NOW()),
(4, 'Home', 'Amit Patel', '9876543212', '12 SG Highway', 'Ahmedabad', 'Gujarat', '380015', true, NOW()),
(5, 'Home', 'Sneha Reddy', '9876543213', '34 Banjara Hills', 'Hyderabad', 'Telangana', '500034', true, NOW());

-- =====================================================
-- 3. CATEGORIES
-- =====================================================
INSERT INTO categories (name, slug, description, image, parent_id, is_active, display_order, created_at) VALUES
-- Main Categories
('Electronics', 'electronics', 'Latest electronic gadgets and devices', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500', NULL, true, 1, NOW()),
('Fashion', 'fashion', 'Trendy clothing and accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500', NULL, true, 2, NOW()),
('Home & Kitchen', 'home-kitchen', 'Everything for your home', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500', NULL, true, 3, NOW()),
('Beauty & Personal Care', 'beauty-personal-care', 'Beauty and grooming products', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500', NULL, true, 4, NOW()),
('Sports & Fitness', 'sports-fitness', 'Sports equipment and fitness gear', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500', NULL, true, 5, NOW()),
('Books & Stationery', 'books-stationery', 'Books, notebooks, and office supplies', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500', NULL, true, 6, NOW()),
('Toys & Games', 'toys-games', 'Fun toys and games for all ages', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500', NULL, true, 7, NOW()),
('Groceries', 'groceries', 'Fresh groceries and daily essentials', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500', NULL, true, 8, NOW()),

-- Electronics Subcategories
('Smartphones', 'smartphones', 'Latest smartphones and accessories', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 1, true, 1, NOW()),
('Laptops', 'laptops', 'Laptops and notebooks', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', 1, true, 2, NOW()),
('Headphones', 'headphones', 'Headphones and earbuds', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 1, true, 3, NOW()),
('Cameras', 'cameras', 'Digital cameras and accessories', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500', 1, true, 4, NOW()),

-- Fashion Subcategories
('Men''s Clothing', 'mens-clothing', 'Clothing for men', 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=500', 2, true, 1, NOW()),
('Women''s Clothing', 'womens-clothing', 'Clothing for women', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500', 2, true, 2, NOW()),
('Footwear', 'footwear', 'Shoes and sandals', 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500', 2, true, 3, NOW()),
('Accessories', 'accessories', 'Fashion accessories', 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=500', 2, true, 4, NOW());

-- =====================================================
-- 4. PRODUCTS - ELECTRONICS
-- =====================================================
INSERT INTO products (name, description, price, original_price, stock, quantity_unit, quantity_per_unit, category, hsn_code, igst, sgst, cgst, images, highlights, specifications, rating, review_count, admin_review_count, has_variants, created_at) VALUES

-- Smartphones
('iPhone 15 Pro Max', 'Latest Apple iPhone with A17 Pro chip, titanium design, and advanced camera system', 134900, 149900, 50, 'pcs', 1, 'Smartphones', '85171200', 18, 9, 9, 
'["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800", "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"]',
'["A17 Pro chip", "Titanium design", "48MP main camera", "Action button", "USB-C port"]',
'{"Display": "6.7-inch Super Retina XDR", "Processor": "A17 Pro", "RAM": "8GB", "Storage": "256GB", "Camera": "48MP + 12MP + 12MP", "Battery": "4422mAh", "OS": "iOS 17"}',
4.8, 245, 500, true, NOW()),

('Samsung Galaxy S24 Ultra', 'Premium Samsung flagship with S Pen, 200MP camera, and AI features', 124999, 139999, 45, 'pcs', 1, 'Smartphones', '85171200', 18, 9, 9,
'["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800", "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"]',
'["200MP camera", "S Pen included", "Snapdragon 8 Gen 3", "5000mAh battery", "AI photo editing"]',
'{"Display": "6.8-inch Dynamic AMOLED 2X", "Processor": "Snapdragon 8 Gen 3", "RAM": "12GB", "Storage": "256GB", "Camera": "200MP + 50MP + 12MP + 10MP", "Battery": "5000mAh", "OS": "Android 14"}',
4.7, 189, 400, true, NOW()),

('OnePlus 12', 'Flagship killer with Hasselblad camera and 100W fast charging', 64999, 69999, 60, 'pcs', 1, 'Smartphones', '85171200', 18, 9, 9,
'["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800"]',
'["Snapdragon 8 Gen 3", "100W SUPERVOOC charging", "Hasselblad camera", "120Hz AMOLED display", "5400mAh battery"]',
'{"Display": "6.82-inch AMOLED", "Processor": "Snapdragon 8 Gen 3", "RAM": "12GB", "Storage": "256GB", "Camera": "50MP + 64MP + 48MP", "Battery": "5400mAh", "OS": "OxygenOS 14"}',
4.6, 156, 350, true, NOW()),

-- Laptops
('MacBook Pro 14" M3', 'Powerful laptop with M3 chip, Liquid Retina XDR display', 169900, 189900, 30, 'pcs', 1, 'Laptops', '84713010', 18, 9, 9,
'["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"]',
'["M3 chip", "14.2-inch Liquid Retina XDR", "Up to 22 hours battery", "Three Thunderbolt 4 ports", "MagSafe 3 charging"]',
'{"Display": "14.2-inch Liquid Retina XDR", "Processor": "Apple M3", "RAM": "16GB", "Storage": "512GB SSD", "Graphics": "10-core GPU", "Battery": "70Wh", "Weight": "1.55kg"}',
4.9, 178, 300, false, NOW()),

('Dell XPS 15', 'Premium Windows laptop with InfinityEdge display and powerful performance', 149999, 169999, 25, 'pcs', 1, 'Laptops', '84713010', 18, 9, 9,
'["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800", "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800"]',
'["15.6-inch 4K OLED", "Intel Core i7 13th Gen", "NVIDIA RTX 4050", "Premium aluminum build", "Thunderbolt 4"]',
'{"Display": "15.6-inch 4K OLED", "Processor": "Intel Core i7-13700H", "RAM": "16GB DDR5", "Storage": "1TB SSD", "Graphics": "NVIDIA RTX 4050 6GB", "Battery": "86Wh", "Weight": "1.86kg"}',
4.7, 134, 250, false, NOW()),

('ASUS ROG Strix G16', 'Gaming laptop with RGB lighting and high refresh rate display', 124999, 139999, 35, 'pcs', 1, 'Laptops', '84713010', 18, 9, 9,
'["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800", "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800"]',
'["165Hz display", "Intel Core i9", "RTX 4060", "RGB keyboard", "Advanced cooling"]',
'{"Display": "16-inch FHD 165Hz", "Processor": "Intel Core i9-13980HX", "RAM": "16GB DDR5", "Storage": "1TB SSD", "Graphics": "NVIDIA RTX 4060 8GB", "Battery": "90Wh", "Weight": "2.5kg"}',
4.6, 98, 200, false, NOW()),

-- Headphones
('Sony WH-1000XM5', 'Industry-leading noise canceling headphones with exceptional sound quality', 29990, 34990, 80, 'pcs', 1, 'Headphones', '85183000', 18, 9, 9,
'["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800"]',
'["Industry-leading ANC", "30-hour battery life", "Multipoint connection", "Premium sound quality", "Comfortable design"]',
'{"Type": "Over-ear", "Connectivity": "Bluetooth 5.2", "Battery": "30 hours", "Charging": "USB-C", "Weight": "250g", "Features": "ANC, Ambient Sound, LDAC"}',
4.8, 567, 1000, true, NOW()),

('Apple AirPods Pro 2', 'Premium wireless earbuds with adaptive audio and USB-C charging', 24900, 26900, 100, 'pcs', 1, 'Headphones', '85183000', 18, 9, 9,
'["https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800", "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800"]',
'["Adaptive Audio", "Active Noise Cancellation", "Transparency mode", "USB-C charging", "Personalized Spatial Audio"]',
'{"Type": "In-ear", "Connectivity": "Bluetooth 5.3", "Battery": "6 hours (30 with case)", "Charging": "USB-C, MagSafe, Qi", "Weight": "5.3g per earbud", "Features": "ANC, Transparency, Spatial Audio"}',
4.7, 892, 1500, false, NOW()),

('JBL Tune 760NC', 'Affordable wireless headphones with active noise cancellation', 5999, 7999, 120, 'pcs', 1, 'Headphones', '85183000', 18, 9, 9,
'["https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800"]',
'["Active Noise Cancelling", "50-hour battery", "JBL Pure Bass Sound", "Lightweight design", "Multi-point connection"]',
'{"Type": "Over-ear", "Connectivity": "Bluetooth 5.0", "Battery": "50 hours", "Charging": "USB-C", "Weight": "220g", "Features": "ANC, Voice Assistant"}',
4.5, 234, 500, true, NOW()),

-- Cameras
('Canon EOS R6 Mark II', 'Full-frame mirrorless camera with advanced autofocus and 4K video', 239900, 259900, 15, 'pcs', 1, 'Cameras', '85258020', 18, 9, 9,
'["https://images.unsplash.com/photo-1606980707986-7b0c3f8e8b12?w=800", "https://images.unsplash.com/photo-1606980707986-7b0c3f8e8b12?w=800"]',
'["24.2MP full-frame sensor", "40fps continuous shooting", "6K RAW video", "Advanced dual pixel AF", "In-body stabilization"]',
'{"Sensor": "24.2MP Full-Frame CMOS", "Video": "6K RAW, 4K 60fps", "ISO": "100-102400", "Autofocus": "1053 AF points", "Stabilization": "8-stop IBIS", "Display": "3.2-inch vari-angle touchscreen"}',
4.9, 67, 150, false, NOW()),

('Sony Alpha A7 IV', 'Versatile hybrid camera for photo and video creators', 219900, 239900, 20, 'pcs', 1, 'Cameras', '85258020', 18, 9, 9,
'["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800", "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800"]',
'["33MP full-frame sensor", "Real-time tracking AF", "4K 60fps video", "5-axis stabilization", "Dual card slots"]',
'{"Sensor": "33MP Full-Frame Exmor R", "Video": "4K 60fps 10-bit", "ISO": "100-51200", "Autofocus": "759 phase-detection points", "Stabilization": "5.5-stop IBIS", "Display": "3-inch vari-angle touchscreen"}',
4.8, 89, 180, false, NOW());

-- =====================================================
-- 5. PRODUCTS - FASHION
-- =====================================================
INSERT INTO products (name, description, price, original_price, stock, quantity_unit, quantity_per_unit, category, hsn_code, igst, sgst, cgst, images, highlights, specifications, rating, review_count, admin_review_count, has_variants, created_at) VALUES

-- Men's Clothing
('Levi''s 511 Slim Fit Jeans', 'Classic slim fit jeans with stretch comfort', 3499, 4999, 150, 'pcs', 1, 'Men''s Clothing', '62034200', 12, 6, 6,
'["https://images.unsplash.com/photo-1542272604-787c3835535d?w=800", "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"]',
'["Slim fit design", "Stretch denim", "Classic 5-pocket styling", "Durable construction", "Multiple washes available"]',
'{"Material": "98% Cotton, 2% Elastane", "Fit": "Slim", "Rise": "Mid-rise", "Closure": "Zipper fly with button", "Care": "Machine wash cold"}',
4.6, 456, 800, true, NOW()),

('Nike Dri-FIT Training T-Shirt', 'Moisture-wicking athletic t-shirt for workouts', 1799, 2499, 200, 'pcs', 1, 'Men''s Clothing', '61091000', 12, 6, 6,
'["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"]',
'["Dri-FIT technology", "Breathable fabric", "Athletic fit", "Swoosh logo", "Multiple colors"]',
'{"Material": "100% Polyester", "Technology": "Dri-FIT moisture wicking", "Fit": "Athletic", "Neckline": "Crew neck", "Care": "Machine washable"}',
4.5, 678, 1200, true, NOW()),

('Allen Solly Formal Shirt', 'Premium cotton formal shirt for office wear', 1999, 2999, 180, 'pcs', 1, 'Men''s Clothing', '62052000', 12, 6, 6,
'["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800"]',
'["100% cotton", "Wrinkle-free fabric", "Slim fit", "Spread collar", "Professional look"]',
'{"Material": "100% Cotton", "Fit": "Slim", "Collar": "Spread", "Sleeve": "Full sleeve", "Pattern": "Solid", "Care": "Machine wash"}',
4.4, 234, 500, true, NOW()),

-- Women's Clothing
('Zara Floral Maxi Dress', 'Elegant floral print maxi dress perfect for summer', 3999, 5999, 100, 'pcs', 1, 'Women''s Clothing', '62044200', 12, 6, 6,
'["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"]',
'["Floral print", "Maxi length", "Flowy silhouette", "V-neckline", "Adjustable straps"]',
'{"Material": "100% Viscose", "Length": "Maxi", "Fit": "Regular", "Neckline": "V-neck", "Occasion": "Casual, Party", "Care": "Hand wash"}',
4.7, 345, 600, true, NOW()),

('H&M High-Waisted Jeans', 'Trendy high-waisted skinny jeans with stretch', 2499, 3499, 160, 'pcs', 1, 'Women''s Clothing', '62046200', 12, 6, 6,
'["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800"]',
'["High-waisted design", "Skinny fit", "Stretch denim", "5-pocket styling", "Versatile styling"]',
'{"Material": "79% Cotton, 20% Polyester, 1% Elastane", "Fit": "Skinny", "Rise": "High-rise", "Closure": "Zipper fly", "Care": "Machine wash"}',
4.6, 567, 1000, true, NOW()),

('Forever 21 Crop Top', 'Stylish crop top for casual outings', 799, 1299, 250, 'pcs', 1, 'Women''s Clothing', '61091000', 12, 6, 6,
'["https://images.unsplash.com/photo-1564859228273-274232fdb516?w=800", "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=800"]',
'["Cropped length", "Soft fabric", "Round neckline", "Short sleeves", "Trendy design"]',
'{"Material": "95% Cotton, 5% Spandex", "Length": "Cropped", "Fit": "Regular", "Neckline": "Round", "Sleeve": "Short", "Care": "Machine wash"}',
4.3, 789, 1500, true, NOW()),

-- Footwear
('Adidas Ultraboost 23', 'Premium running shoes with responsive cushioning', 16999, 18999, 90, 'pcs', 1, 'Footwear', '64041100', 12, 6, 6,
'["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"]',
'["Boost cushioning", "Primeknit upper", "Continental rubber outsole", "Supportive heel counter", "Energy return"]',
'{"Upper": "Primeknit", "Midsole": "Boost", "Outsole": "Continental Rubber", "Drop": "10mm", "Weight": "310g", "Use": "Running, Training"}',
4.8, 234, 500, true, NOW()),

('Nike Air Force 1', 'Iconic sneakers with timeless design', 8999, 9999, 120, 'pcs', 1, 'Footwear', '64041100', 12, 6, 6,
'["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800", "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800"]',
'["Classic design", "Air cushioning", "Leather upper", "Durable rubber outsole", "Versatile style"]',
'{"Upper": "Leather", "Midsole": "Air cushioning", "Outsole": "Rubber", "Closure": "Lace-up", "Style": "Low-top", "Use": "Casual"}',
4.7, 890, 1500, true, NOW()),

('Bata Formal Shoes', 'Classic leather formal shoes for office wear', 2999, 3999, 100, 'pcs', 1, 'Footwear', '64035100', 12, 6, 6,
'["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800", "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800"]',
'["Genuine leather", "Cushioned insole", "Slip-resistant sole", "Classic design", "Professional look"]',
'{"Upper": "Genuine Leather", "Lining": "Textile", "Insole": "Cushioned", "Outsole": "TPR", "Closure": "Lace-up", "Occasion": "Formal"}',
4.5, 345, 700, true, NOW());

-- =====================================================
-- 6. PRODUCTS - HOME & KITCHEN
-- =====================================================
INSERT INTO products (name, description, price, original_price, stock, quantity_unit, quantity_per_unit, category, hsn_code, igst, sgst, cgst, images, highlights, specifications, rating, review_count, admin_review_count, has_variants, created_at) VALUES

('Prestige Induction Cooktop', 'Energy-efficient induction cooktop with preset cooking menus', 3499, 4999, 75, 'pcs', 1, 'Home & Kitchen', '85166010', 18, 9, 9,
'["https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800", "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800"]',
'["2000W power", "Preset cooking menus", "Auto shut-off", "Touch controls", "Energy efficient"]',
'{"Power": "2000W", "Voltage": "230V", "Cooking Modes": "8 preset menus", "Timer": "3 hours", "Safety": "Auto shut-off, overheat protection", "Warranty": "1 year"}',
4.6, 456, 800, false, NOW()),

('Philips Air Fryer', 'Healthy cooking with rapid air technology', 8999, 11999, 60, 'pcs', 1, 'Home & Kitchen', '85167100', 18, 9, 9,
'["https://images.unsplash.com/photo-1585515320310-259814833e62?w=800", "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800"]',
'["Rapid Air Technology", "4.1L capacity", "Digital display", "Dishwasher safe parts", "90% less fat"]',
'{"Capacity": "4.1 liters", "Power": "1400W", "Temperature": "Up to 200°C", "Timer": "60 minutes", "Programs": "7 preset programs", "Warranty": "2 years"}',
4.7, 678, 1200, false, NOW()),

('Milton Thermosteel Flask', 'Vacuum insulated flask keeps beverages hot/cold for 24 hours', 899, 1299, 200, 'pcs', 1, 'Home & Kitchen', '96170010', 18, 9, 9,
'["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800", "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800"]',
'["24-hour temperature retention", "Stainless steel", "Leak-proof cap", "1 liter capacity", "Durable construction"]',
'{"Capacity": "1000ml", "Material": "Stainless Steel 304", "Insulation": "Vacuum insulated", "Hot Retention": "24 hours", "Cold Retention": "24 hours", "Warranty": "1 year"}',
4.5, 1234, 2000, true, NOW()),

('Cello Storage Container Set', 'Airtight food storage containers - Set of 6', 599, 999, 150, 'set', 1, 'Home & Kitchen', '39231000', 18, 9, 9,
'["https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800", "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800"]',
'["Airtight seal", "BPA free", "Microwave safe", "Transparent design", "Set of 6 containers"]',
'{"Material": "Food-grade plastic", "Pieces": "6 containers with lids", "Sizes": "300ml, 500ml, 750ml, 1000ml", "Features": "Airtight, Stackable, Microwave safe", "Care": "Dishwasher safe"}',
4.4, 567, 1000, false, NOW()),

('Havells Ceiling Fan', '1200mm energy-efficient ceiling fan with remote control', 3999, 5499, 80, 'pcs', 1, 'Home & Kitchen', '84145100', 18, 9, 9,
'["https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800", "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"]',
'["1200mm sweep", "Remote control", "5-star energy rating", "Aerodynamic blades", "Silent operation"]',
'{"Sweep": "1200mm", "Speed": "3 speeds", "Power": "75W", "Air Delivery": "230 CMM", "Control": "Remote control", "Warranty": "2 years"}',
4.6, 345, 600, true, NOW());

-- =====================================================
-- 7. PRODUCTS - BEAUTY & PERSONAL CARE
-- =====================================================
INSERT INTO products (name, description, price, original_price, stock, quantity_unit, quantity_per_unit, category, hsn_code, igst, sgst, cgst, images, highlights, specifications, rating, review_count, admin_review_count, has_variants, created_at) VALUES

('Lakme Absolute Lipstick', 'Long-lasting matte lipstick with rich color', 599, 799, 300, 'pcs', 1, 'Beauty & Personal Care', '33041000', 18, 9, 9,
'["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800", "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800"]',
'["Matte finish", "Long-lasting", "Rich pigmentation", "Smooth application", "Vitamin E enriched"]',
'{"Type": "Matte lipstick", "Weight": "3.6g", "Finish": "Matte", "Benefits": "Long-lasting, Moisturizing", "Ingredients": "Vitamin E, Natural oils"}',
4.5, 890, 1500, true, NOW()),

('Neutrogena Deep Clean Face Wash', 'Oil-free face wash for deep cleansing', 349, 449, 250, 'pcs', 1, 'Beauty & Personal Care', '33049100', 18, 9, 9,
'["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800", "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800"]',
'["Oil-free formula", "Deep cleansing", "Removes 99% dirt", "Dermatologist tested", "For all skin types"]',
'{"Volume": "200ml", "Type": "Face wash", "Skin Type": "All skin types", "Benefits": "Deep cleansing, Oil control", "pH": "Balanced"}',
4.6, 1234, 2000, false, NOW()),

('Gillette Mach3 Razor', 'Premium men''s razor with 3 blades for close shave', 299, 399, 400, 'pcs', 1, 'Beauty & Personal Care', '82121000', 18, 9, 9,
'["https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800", "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800"]',
'["3 precision blades", "Lubrication strip", "Ergonomic handle", "Close shave", "Long-lasting blades"]',
'{"Blades": "3 precision blades", "Handle": "Ergonomic grip", "Features": "Lubrication strip, Pivoting head", "Suitable for": "All skin types"}',
4.7, 2345, 4000, false, NOW()),

('Dove Body Lotion', 'Nourishing body lotion with deep moisture', 399, 499, 200, 'pcs', 1, 'Beauty & Personal Care', '33049900', 18, 9, 9,
'["https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800", "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800"]',
'["Deep moisture", "Non-greasy formula", "24-hour hydration", "Dermatologist recommended", "Suitable for sensitive skin"]',
'{"Volume": "400ml", "Type": "Body lotion", "Skin Type": "All skin types", "Benefits": "Deep moisturization, Nourishment", "Absorption": "Fast absorbing"}',
4.6, 1567, 2500, false, NOW()),

('Philips Trimmer', 'Cordless beard trimmer with 20 length settings', 1999, 2999, 100, 'pcs', 1, 'Beauty & Personal Care', '85109000', 18, 9, 9,
'["https://images.unsplash.com/photo-1621607512214-68297480165e?w=800", "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800"]',
'["20 length settings", "Cordless operation", "60 minutes runtime", "Self-sharpening blades", "Washable"]',
'{"Length Settings": "20 (0.5mm to 10mm)", "Battery": "Rechargeable Li-ion", "Runtime": "60 minutes", "Charging": "8 hours", "Blades": "Stainless steel, Self-sharpening", "Warranty": "2 years"}',
4.5, 678, 1200, false, NOW());

-- =====================================================
-- 8. PRODUCTS - SPORTS & FITNESS
-- =====================================================
INSERT INTO products (name, description, price, original_price, stock, quantity_unit, quantity_per_unit, category, hsn_code, igst, sgst, cgst, images, highlights, specifications, rating, review_count, admin_review_count, has_variants, created_at) VALUES

('Nivia Storm Football', 'Professional quality football for matches and training', 899, 1299, 150, 'pcs', 1, 'Sports & Fitness', '95066200', 18, 9, 9,
'["https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800", "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800"]',
'["Size 5", "PU material", "Machine stitched", "Durable construction", "All-weather use"]',
'{"Size": "5 (Official)", "Material": "PU synthetic leather", "Construction": "Machine stitched", "Bladder": "Rubber", "Use": "Match and training", "Weight": "410-450g"}',
4.5, 456, 800, false, NOW()),

('Cosco Yoga Mat', 'Anti-slip yoga mat with carrying strap', 699, 999, 200, 'pcs', 1, 'Sports & Fitness', '95069110', 18, 9, 9,
'["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800", "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800"]',
'["6mm thickness", "Anti-slip surface", "Eco-friendly material", "Carrying strap included", "Easy to clean"]',
'{"Dimensions": "183cm x 61cm x 6mm", "Material": "NBR foam", "Features": "Anti-slip, Moisture resistant", "Weight": "900g", "Accessories": "Carrying strap"}',
4.4, 567, 1000, true, NOW()),

('Strauss Adjustable Dumbbells', 'Set of 2 adjustable dumbbells - 10kg each', 2499, 3499, 80, 'set', 1, 'Sports & Fitness', '95069990', 18, 9, 9,
'["https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800"]',
'["Adjustable weight", "Chrome finish", "Anti-slip grip", "Durable construction", "Space-saving design"]',
'{"Weight": "10kg per dumbbell", "Material": "Cast iron with chrome plating", "Grip": "Textured anti-slip", "Adjustability": "2.5kg to 10kg", "Set includes": "2 dumbbells, Weight plates"}',
4.6, 234, 500, false, NOW()),

('Yonex Badminton Racket', 'Lightweight carbon fiber badminton racket', 3999, 5499, 60, 'pcs', 1, 'Sports & Fitness', '95065100', 18, 9, 9,
'["https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800", "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800"]',
'["Carbon fiber frame", "Lightweight design", "Isometric head shape", "Pre-strung", "Professional quality"]',
'{"Material": "Carbon fiber", "Weight": "85g", "Grip Size": "G4", "String Tension": "20-28 lbs", "Balance": "Head heavy", "Level": "Intermediate to Advanced"}',
4.7, 345, 600, false, NOW()),

('Decathlon Resistance Bands Set', 'Set of 5 resistance bands for strength training', 999, 1499, 120, 'set', 1, 'Sports & Fitness', '95069990', 18, 9, 9,
'["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800", "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800"]',
'["5 resistance levels", "Latex-free material", "Portable", "Versatile exercises", "Carrying bag included"]',
'{"Pieces": "5 bands", "Resistance Levels": "X-Light to X-Heavy", "Material": "TPE (latex-free)", "Length": "60cm", "Accessories": "Carrying bag, Exercise guide"}',
4.5, 678, 1200, false, NOW());

-- =====================================================
-- 9. PRODUCTS - BOOKS & STATIONERY
-- =====================================================
INSERT INTO products (name, description, price, original_price, stock, quantity_unit, quantity_per_unit, category, hsn_code, igst, sgst, cgst, images, highlights, specifications, rating, review_count, admin_review_count, has_variants, created_at) VALUES

('Atomic Habits by James Clear', 'Bestselling book on building good habits and breaking bad ones', 499, 699, 200, 'pcs', 1, 'Books & Stationery', '49019900', 0, 0, 0,
'["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800"]',
'["International bestseller", "Practical strategies", "Evidence-based", "Life-changing habits", "Easy to implement"]',
'{"Author": "James Clear", "Pages": "320", "Publisher": "Penguin Random House", "Language": "English", "Binding": "Paperback", "ISBN": "9780735211292"}',
4.8, 3456, 5000, false, NOW()),

('Classmate Notebook Bundle', 'Pack of 6 single-line notebooks - 172 pages each', 299, 399, 500, 'pack', 6, 'Books & Stationery', '48201030', 12, 6, 6,
'["https://images.unsplash.com/photo-1517842645767-c639042777db?w=800", "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800"]',
'["Pack of 6", "172 pages each", "Single line ruling", "Quality paper", "Durable binding"]',
'{"Pages": "172 per notebook", "Ruling": "Single line", "Size": "297mm x 210mm", "Paper Quality": "70 GSM", "Binding": "Long book binding", "Pack": "6 notebooks"}',
4.6, 1234, 2000, false, NOW()),

('Parker Jotter Pen', 'Classic ballpoint pen with stainless steel body', 399, 599, 300, 'pcs', 1, 'Books & Stationery', '96081010', 18, 9, 9,
'["https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800", "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800"]',
'["Stainless steel body", "Smooth writing", "Retractable design", "Refillable", "Premium quality"]',
'{"Type": "Ballpoint pen", "Body": "Stainless steel", "Ink Color": "Blue", "Tip Size": "Medium", "Mechanism": "Retractable", "Refillable": "Yes"}',
4.7, 567, 1000, true, NOW()),

('Faber-Castell Art Set', 'Complete art set with pencils, colors, and accessories', 1499, 1999, 100, 'set', 1, 'Books & Stationery', '96091000', 18, 9, 9,
'["https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800"]',
'["Complete art set", "Premium quality", "Multiple mediums", "Portable case", "Perfect for artists"]',
'{"Contents": "24 color pencils, 12 sketch pencils, Eraser, Sharpener, Ruler", "Case": "Metal tin", "Quality": "Artist grade", "Brand": "Faber-Castell"}',
4.8, 234, 500, false, NOW()),

('HP DeskJet Printer Paper', 'A4 size copier paper - 500 sheets', 349, 449, 250, 'pack', 500, 'Books & Stationery', '48025610', 12, 6, 6,
'["https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800", "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800"]',
'["500 sheets", "A4 size", "75 GSM", "Bright white", "Multipurpose use"]',
'{"Size": "A4 (210mm x 297mm)", "Sheets": "500", "Weight": "75 GSM", "Brightness": "High white", "Use": "Printing, Copying, Writing"}',
4.5, 890, 1500, false, NOW());

-- =====================================================
-- 10. PRODUCTS - TOYS & GAMES
-- =====================================================
INSERT INTO products (name, description, price, original_price, stock, quantity_unit, quantity_per_unit, category, hsn_code, igst, sgst, cgst, images, highlights, specifications, rating, review_count, admin_review_count, has_variants, created_at) VALUES

('LEGO Classic Creative Bricks', 'Build anything with this creative LEGO brick set', 2999, 3999, 80, 'set', 1, 'Toys & Games', '95030010', 18, 9, 9,
'["https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800", "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800"]',
'["484 pieces", "Multiple colors", "Endless creativity", "Age 4+", "Storage box included"]',
'{"Pieces": "484", "Age": "4+ years", "Colors": "35 different colors", "Includes": "Building instructions, Storage box", "Theme": "Creative building"}',
4.8, 456, 800, false, NOW()),

('Hot Wheels 5-Car Pack', 'Pack of 5 die-cast Hot Wheels cars', 799, 999, 200, 'pack', 5, 'Toys & Games', '95030030', 18, 9, 9,
'["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"]',
'["5 cars included", "Die-cast metal", "1:64 scale", "Authentic details", "Collectible"]',
'{"Scale": "1:64", "Material": "Die-cast metal and plastic", "Cars": "5 assorted vehicles", "Age": "3+ years", "Features": "Authentic decos, Real Riders wheels"}',
4.6, 678, 1200, false, NOW()),

('Barbie Dreamhouse Doll', 'Fashion doll with accessories and outfits', 1499, 1999, 150, 'pcs', 1, 'Toys & Games', '95030021', 18, 9, 9,
'["https://images.unsplash.com/photo-1582825928928-1e0e2e0b5e51?w=800", "https://images.unsplash.com/photo-1582825928928-1e0e2e0b5e51?w=800"]',
'["Fashion doll", "Multiple outfits", "Accessories included", "Poseable", "Age 3+"]',
'{"Height": "29cm", "Outfits": "3 fashion outfits", "Accessories": "Shoes, Bag, Jewelry", "Age": "3+ years", "Features": "Fully poseable, Brushable hair"}',
4.7, 567, 1000, false, NOW()),

('Monopoly Board Game', 'Classic family board game of property trading', 1299, 1799, 100, 'pcs', 1, 'Toys & Games', '95049010', 18, 9, 9,
'["https://images.unsplash.com/photo-1611891487603-3c5c9e8c1d7d?w=800", "https://images.unsplash.com/photo-1611891487603-3c5c9e8c1d7d?w=800"]',
'["Classic edition", "2-6 players", "Family game", "Strategic gameplay", "Complete set"]',
'{"Players": "2-6", "Age": "8+ years", "Duration": "60-180 minutes", "Contents": "Game board, Cards, Money, Tokens, Dice, Houses, Hotels", "Type": "Strategy board game"}',
4.7, 890, 1500, false, NOW()),

('Rubik''s Cube 3x3', 'Original Rubik''s Cube puzzle', 499, 699, 250, 'pcs', 1, 'Toys & Games', '95030070', 18, 9, 9,
'["https://images.unsplash.com/photo-1591991731833-b8e1e2e8f8f9?w=800", "https://images.unsplash.com/photo-1591991731833-b8e1e2e8f8f9?w=800"]',
'["Original Rubik''s", "3x3 cube", "Smooth turning", "Brain teaser", "Age 8+"]',
'{"Size": "3x3x3", "Dimensions": "5.7cm x 5.7cm x 5.7cm", "Age": "8+ years", "Difficulty": "43 quintillion combinations", "Features": "Smooth mechanism, Vibrant colors"}',
4.6, 1234, 2000, false, NOW());

-- =====================================================
-- 11. PRODUCTS - GROCERIES
-- =====================================================
INSERT INTO products (name, description, price, original_price, stock, quantity_unit, quantity_per_unit, category, hsn_code, igst, sgst, cgst, images, highlights, specifications, rating, review_count, admin_review_count, has_variants, created_at) VALUES

('Fortune Sunflower Oil', 'Refined sunflower oil for healthy cooking', 899, 999, 300, 'liter', 5, 'Groceries', '15121100', 5, 2.5, 2.5,
'["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800", "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800"]',
'["5 liter pack", "Refined oil", "Rich in Vitamin E", "Light and healthy", "Cholesterol free"]',
'{"Volume": "5 liters", "Type": "Refined sunflower oil", "Benefits": "Rich in Vitamin E, Heart healthy", "Use": "Cooking, Frying", "Packaging": "PET bottle"}',
4.5, 2345, 4000, false, NOW()),

('India Gate Basmati Rice', 'Premium aged basmati rice', 1299, 1499, 250, 'kg', 5, 'Groceries', '10063020', 5, 2.5, 2.5,
'["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800"]',
'["5kg pack", "Aged basmati", "Long grain", "Aromatic", "Premium quality"]',
'{"Weight": "5kg", "Type": "Basmati rice", "Grain": "Long grain", "Aging": "Aged", "Origin": "India", "Cooking": "Fluffy texture"}',
4.6, 1567, 2500, false, NOW()),

('Tata Tea Premium', 'Strong and flavorful tea leaves', 499, 599, 400, 'gm', 1000, 'Groceries', '09023010', 5, 2.5, 2.5,
'["https://images.unsplash.com/photo-1597318130878-aa1caa49b8e6?w=800", "https://images.unsplash.com/photo-1597318130878-aa1caa49b8e6?w=800"]',
'["1kg pack", "Premium blend", "Strong flavor", "Rich aroma", "Fresh tea leaves"]',
'{"Weight": "1000g", "Type": "Black tea", "Blend": "Premium Assam blend", "Flavor": "Strong and rich", "Packaging": "Vacuum sealed"}',
4.7, 3456, 5000, false, NOW()),

('Amul Butter', 'Fresh and creamy table butter', 249, 279, 500, 'gm', 500, 'Groceries', '04051000', 12, 6, 6,
'["https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800", "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800"]',
'["500g pack", "Fresh butter", "Creamy texture", "Made from milk", "Refrigerated product"]',
'{"Weight": "500g", "Type": "Table butter", "Fat Content": "80%", "Ingredients": "Milk fat, Salt", "Storage": "Refrigerate", "Shelf Life": "6 months"}',
4.6, 2890, 4500, false, NOW()),

('Maggi 2-Minute Noodles', 'Instant noodles - Pack of 12', 144, 180, 600, 'pack', 12, 'Groceries', '19023010', 12, 6, 6,
'["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800", "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800"]',
'["Pack of 12", "2-minute cooking", "Masala flavor", "Quick snack", "Family pack"]',
'{"Pack Size": "12 x 70g", "Flavor": "Masala", "Cooking Time": "2 minutes", "Ingredients": "Wheat flour, Palm oil, Spices", "Shelf Life": "12 months"}',
4.5, 4567, 7000, false, NOW()),

('Britannia Good Day Cookies', 'Butter cookies with cashew and almond', 99, 120, 800, 'gm', 600, 'Groceries', '19053100', 12, 6, 6,
'["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800", "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800"]',
'["600g family pack", "Butter cookies", "Cashew & almond", "Crispy texture", "Tea-time snack"]',
'{"Weight": "600g", "Type": "Butter cookies", "Ingredients": "Wheat flour, Sugar, Butter, Cashew, Almond", "Texture": "Crispy", "Shelf Life": "9 months"}',
4.4, 3456, 6000, false, NOW());