-- =====================================================
-- BLINKEACH E-COMMERCE - PART 2
-- Product Variants, Reviews, Orders, and Related Data
-- =====================================================

-- =====================================================
-- 12. PRODUCT VARIANTS (for products with has_variants = true)
-- =====================================================

-- iPhone 15 Pro Max Variants (Product ID: 1)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(1, 'Natural Titanium', '#8B8680', '256GB', 15, 'IPH15PM-NT-256', NULL, true, NOW()),
(1, 'Natural Titanium', '#8B8680', '512GB', 12, 'IPH15PM-NT-512', 154900, true, NOW()),
(1, 'Blue Titanium', '#4A5568', '256GB', 18, 'IPH15PM-BT-256', NULL, true, NOW()),
(1, 'Blue Titanium', '#4A5568', '512GB', 10, 'IPH15PM-BT-512', 154900, true, NOW()),
(1, 'Black Titanium', '#1A1A1A', '256GB', 20, 'IPH15PM-BLT-256', NULL, true, NOW()),
(1, 'White Titanium', '#F5F5F5', '256GB', 15, 'IPH15PM-WT-256', NULL, true, NOW());

-- Samsung Galaxy S24 Ultra Variants (Product ID: 2)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(2, 'Titanium Gray', '#71797E', '256GB', 15, 'S24U-TG-256', NULL, true, NOW()),
(2, 'Titanium Gray', '#71797E', '512GB', 10, 'S24U-TG-512', 144999, true, NOW()),
(2, 'Titanium Black', '#2C2C2C', '256GB', 18, 'S24U-TB-256', NULL, true, NOW()),
(2, 'Titanium Violet', '#8B7BA8', '256GB', 12, 'S24U-TV-256', NULL, true, NOW());

-- OnePlus 12 Variants (Product ID: 3)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(3, 'Flowy Emerald', '#50C878', '256GB', 20, 'OP12-FE-256', NULL, true, NOW()),
(3, 'Silky Black', '#000000', '256GB', 25, 'OP12-SB-256', NULL, true, NOW()),
(3, 'Silky Black', '#000000', '512GB', 15, 'OP12-SB-512', 74999, true, NOW());

-- Sony WH-1000XM5 Variants (Product ID: 7)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(7, 'Black', '#000000', 'Standard', 40, 'SONY-XM5-BLK', NULL, true, NOW()),
(7, 'Silver', '#C0C0C0', 'Standard', 25, 'SONY-XM5-SLV', NULL, true, NOW()),
(7, 'Midnight Blue', '#191970', 'Standard', 15, 'SONY-XM5-MDB', NULL, true, NOW());

-- JBL Tune 760NC Variants (Product ID: 9)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(9, 'Black', '#000000', 'Standard', 50, 'JBL-760-BLK', NULL, true, NOW()),
(9, 'White', '#FFFFFF', 'Standard', 40, 'JBL-760-WHT', NULL, true, NOW()),
(9, 'Blue', '#0000FF', 'Standard', 30, 'JBL-760-BLU', NULL, true, NOW());

-- Levi's 511 Jeans Variants (Product ID: 12)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(12, 'Dark Blue', '#00008B', '30', 20, 'LEVI511-DB-30', NULL, true, NOW()),
(12, 'Dark Blue', '#00008B', '32', 25, 'LEVI511-DB-32', NULL, true, NOW()),
(12, 'Dark Blue', '#00008B', '34', 30, 'LEVI511-DB-34', NULL, true, NOW()),
(12, 'Dark Blue', '#00008B', '36', 20, 'LEVI511-DB-36', NULL, true, NOW()),
(12, 'Light Blue', '#ADD8E6', '30', 15, 'LEVI511-LB-30', NULL, true, NOW()),
(12, 'Light Blue', '#ADD8E6', '32', 20, 'LEVI511-LB-32', NULL, true, NOW()),
(12, 'Light Blue', '#ADD8E6', '34', 20, 'LEVI511-LB-34', NULL, true, NOW()),
(12, 'Black', '#000000', '32', 25, 'LEVI511-BLK-32', NULL, true, NOW()),
(12, 'Black', '#000000', '34', 30, 'LEVI511-BLK-34', NULL, true, NOW());

-- Nike Dri-FIT T-Shirt Variants (Product ID: 13)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(13, 'Black', '#000000', 'S', 30, 'NIKE-DF-BLK-S', NULL, true, NOW()),
(13, 'Black', '#000000', 'M', 40, 'NIKE-DF-BLK-M', NULL, true, NOW()),
(13, 'Black', '#000000', 'L', 50, 'NIKE-DF-BLK-L', NULL, true, NOW()),
(13, 'Black', '#000000', 'XL', 40, 'NIKE-DF-BLK-XL', NULL, true, NOW()),
(13, 'White', '#FFFFFF', 'M', 35, 'NIKE-DF-WHT-M', NULL, true, NOW()),
(13, 'White', '#FFFFFF', 'L', 45, 'NIKE-DF-WHT-L', NULL, true, NOW()),
(13, 'Navy Blue', '#000080', 'M', 30, 'NIKE-DF-NB-M', NULL, true, NOW()),
(13, 'Navy Blue', '#000080', 'L', 35, 'NIKE-DF-NB-L', NULL, true, NOW()),
(13, 'Red', '#FF0000', 'M', 25, 'NIKE-DF-RED-M', NULL, true, NOW()),
(13, 'Red', '#FF0000', 'L', 30, 'NIKE-DF-RED-L', NULL, true, NOW());

-- Allen Solly Formal Shirt Variants (Product ID: 14)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(14, 'White', '#FFFFFF', '38', 25, 'AS-FS-WHT-38', NULL, true, NOW()),
(14, 'White', '#FFFFFF', '40', 30, 'AS-FS-WHT-40', NULL, true, NOW()),
(14, 'White', '#FFFFFF', '42', 35, 'AS-FS-WHT-42', NULL, true, NOW()),
(14, 'Light Blue', '#ADD8E6', '38', 20, 'AS-FS-LB-38', NULL, true, NOW()),
(14, 'Light Blue', '#ADD8E6', '40', 25, 'AS-FS-LB-40', NULL, true, NOW()),
(14, 'Light Blue', '#ADD8E6', '42', 30, 'AS-FS-LB-42', NULL, true, NOW()),
(14, 'Pink', '#FFC0CB', '40', 20, 'AS-FS-PNK-40', NULL, true, NOW()),
(14, 'Pink', '#FFC0CB', '42', 25, 'AS-FS-PNK-42', NULL, true, NOW());

-- Zara Floral Maxi Dress Variants (Product ID: 15)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(15, 'Floral Blue', '#4169E1', 'S', 15, 'ZARA-FMD-FB-S', NULL, true, NOW()),
(15, 'Floral Blue', '#4169E1', 'M', 25, 'ZARA-FMD-FB-M', NULL, true, NOW()),
(15, 'Floral Blue', '#4169E1', 'L', 20, 'ZARA-FMD-FB-L', NULL, true, NOW()),
(15, 'Floral Pink', '#FF69B4', 'S', 12, 'ZARA-FMD-FP-S', NULL, true, NOW()),
(15, 'Floral Pink', '#FF69B4', 'M', 20, 'ZARA-FMD-FP-M', NULL, true, NOW()),
(15, 'Floral Pink', '#FF69B4', 'L', 18, 'ZARA-FMD-FP-L', NULL, true, NOW());

-- H&M High-Waisted Jeans Variants (Product ID: 16)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(16, 'Dark Denim', '#1560BD', '26', 20, 'HM-HWJ-DD-26', NULL, true, NOW()),
(16, 'Dark Denim', '#1560BD', '28', 30, 'HM-HWJ-DD-28', NULL, true, NOW()),
(16, 'Dark Denim', '#1560BD', '30', 35, 'HM-HWJ-DD-30', NULL, true, NOW()),
(16, 'Dark Denim', '#1560BD', '32', 25, 'HM-HWJ-DD-32', NULL, true, NOW()),
(16, 'Light Wash', '#B0C4DE', '28', 20, 'HM-HWJ-LW-28', NULL, true, NOW()),
(16, 'Light Wash', '#B0C4DE', '30', 25, 'HM-HWJ-LW-30', NULL, true, NOW()),
(16, 'Black', '#000000', '28', 25, 'HM-HWJ-BLK-28', NULL, true, NOW()),
(16, 'Black', '#000000', '30', 30, 'HM-HWJ-BLK-30', NULL, true, NOW());

-- Forever 21 Crop Top Variants (Product ID: 17)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(17, 'White', '#FFFFFF', 'S', 40, 'F21-CT-WHT-S', NULL, true, NOW()),
(17, 'White', '#FFFFFF', 'M', 50, 'F21-CT-WHT-M', NULL, true, NOW()),
(17, 'White', '#FFFFFF', 'L', 45, 'F21-CT-WHT-L', NULL, true, NOW()),
(17, 'Black', '#000000', 'S', 35, 'F21-CT-BLK-S', NULL, true, NOW()),
(17, 'Black', '#000000', 'M', 45, 'F21-CT-BLK-M', NULL, true, NOW()),
(17, 'Black', '#000000', 'L', 40, 'F21-CT-BLK-L', NULL, true, NOW()),
(17, 'Pink', '#FFC0CB', 'S', 30, 'F21-CT-PNK-S', NULL, true, NOW()),
(17, 'Pink', '#FFC0CB', 'M', 40, 'F21-CT-PNK-M', NULL, true, NOW()),
(17, 'Mint Green', '#98FF98', 'M', 35, 'F21-CT-MG-M', NULL, true, NOW());

-- Adidas Ultraboost 23 Variants (Product ID: 18)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(18, 'Core Black', '#000000', 'UK 8', 15, 'ADIDAS-UB23-CB-8', NULL, true, NOW()),
(18, 'Core Black', '#000000', 'UK 9', 20, 'ADIDAS-UB23-CB-9', NULL, true, NOW()),
(18, 'Core Black', '#000000', 'UK 10', 18, 'ADIDAS-UB23-CB-10', NULL, true, NOW()),
(18, 'Cloud White', '#F5F5F5', 'UK 8', 12, 'ADIDAS-UB23-CW-8', NULL, true, NOW()),
(18, 'Cloud White', '#F5F5F5', 'UK 9', 15, 'ADIDAS-UB23-CW-9', NULL, true, NOW()),
(18, 'Cloud White', '#F5F5F5', 'UK 10', 13, 'ADIDAS-UB23-CW-10', NULL, true, NOW());

-- Nike Air Force 1 Variants (Product ID: 19)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(19, 'White', '#FFFFFF', 'UK 7', 18, 'NIKE-AF1-WHT-7', NULL, true, NOW()),
(19, 'White', '#FFFFFF', 'UK 8', 25, 'NIKE-AF1-WHT-8', NULL, true, NOW()),
(19, 'White', '#FFFFFF', 'UK 9', 30, 'NIKE-AF1-WHT-9', NULL, true, NOW()),
(19, 'White', '#FFFFFF', 'UK 10', 25, 'NIKE-AF1-WHT-10', NULL, true, NOW()),
(19, 'Black', '#000000', 'UK 8', 20, 'NIKE-AF1-BLK-8', NULL, true, NOW()),
(19, 'Black', '#000000', 'UK 9', 22, 'NIKE-AF1-BLK-9', NULL, true, NOW());

-- Bata Formal Shoes Variants (Product ID: 20)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(20, 'Black', '#000000', 'UK 7', 15, 'BATA-FS-BLK-7', NULL, true, NOW()),
(20, 'Black', '#000000', 'UK 8', 20, 'BATA-FS-BLK-8', NULL, true, NOW()),
(20, 'Black', '#000000', 'UK 9', 25, 'BATA-FS-BLK-9', NULL, true, NOW()),
(20, 'Black', '#000000', 'UK 10', 20, 'BATA-FS-BLK-10', NULL, true, NOW()),
(20, 'Brown', '#8B4513', 'UK 8', 15, 'BATA-FS-BRN-8', NULL, true, NOW()),
(20, 'Brown', '#8B4513', 'UK 9', 20, 'BATA-FS-BRN-9', NULL, true, NOW());

-- Milton Thermosteel Flask Variants (Product ID: 23)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(23, 'Silver', '#C0C0C0', '1000ml', 80, 'MILTON-TS-SLV-1L', NULL, true, NOW()),
(23, 'Black', '#000000', '1000ml', 60, 'MILTON-TS-BLK-1L', NULL, true, NOW()),
(23, 'Blue', '#0000FF', '1000ml', 40, 'MILTON-TS-BLU-1L', NULL, true, NOW()),
(23, 'Red', '#FF0000', '1000ml', 20, 'MILTON-TS-RED-1L', NULL, true, NOW());

-- Havells Ceiling Fan Variants (Product ID: 25)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(25, 'White', '#FFFFFF', '1200mm', 40, 'HAVELLS-CF-WHT-1200', NULL, true, NOW()),
(25, 'Brown', '#8B4513', '1200mm', 25, 'HAVELLS-CF-BRN-1200', NULL, true, NOW()),
(25, 'Silver', '#C0C0C0', '1200mm', 15, 'HAVELLS-CF-SLV-1200', NULL, true, NOW());

-- Lakme Absolute Lipstick Variants (Product ID: 26)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(26, 'Red Rush', '#DC143C', 'Standard', 50, 'LAKME-AL-RR', NULL, true, NOW()),
(26, 'Pink Blush', '#FFB6C1', 'Standard', 60, 'LAKME-AL-PB', NULL, true, NOW()),
(26, 'Nude Beige', '#F5DEB3', 'Standard', 55, 'LAKME-AL-NB', NULL, true, NOW()),
(26, 'Coral Sunset', '#FF7F50', 'Standard', 45, 'LAKME-AL-CS', NULL, true, NOW()),
(26, 'Berry Wine', '#8B0A50', 'Standard', 40, 'LAKME-AL-BW', NULL, true, NOW()),
(26, 'Mauve Magic', '#E0B0FF', 'Standard', 50, 'LAKME-AL-MM', NULL, true, NOW());

-- Cosco Yoga Mat Variants (Product ID: 32)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(32, 'Purple', '#800080', '6mm', 50, 'COSCO-YM-PUR-6', NULL, true, NOW()),
(32, 'Blue', '#0000FF', '6mm', 60, 'COSCO-YM-BLU-6', NULL, true, NOW()),
(32, 'Pink', '#FFC0CB', '6mm', 45, 'COSCO-YM-PNK-6', NULL, true, NOW()),
(32, 'Green', '#008000', '6mm', 45, 'COSCO-YM-GRN-6', NULL, true, NOW());

-- Parker Jotter Pen Variants (Product ID: 38)
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku, price, is_active, created_at) VALUES
(38, 'Stainless Steel', '#C0C0C0', 'Medium', 100, 'PARKER-J-SS-M', NULL, true, NOW()),
(38, 'Black', '#000000', 'Medium', 80, 'PARKER-J-BLK-M', NULL, true, NOW()),
(38, 'Blue', '#0000FF', 'Medium', 60, 'PARKER-J-BLU-M', NULL, true, NOW()),
(38, 'Red', '#FF0000', 'Medium', 60, 'PARKER-J-RED-M', NULL, true, NOW());

-- =====================================================
-- 13. REVIEWS
-- =====================================================
INSERT INTO reviews (product_id, user_id, rating, title, comment, is_verified_purchase, created_at) VALUES
-- iPhone 15 Pro Max Reviews
(1, 2, 5, 'Best iPhone Ever!', 'The titanium design feels premium and the camera quality is outstanding. Battery life is excellent too!', true, NOW() - INTERVAL '15 days'),
(1, 3, 5, 'Worth Every Penny', 'Upgraded from iPhone 13 Pro. The A17 Pro chip is blazing fast and the action button is very useful.', true, NOW() - INTERVAL '10 days'),
(1, 4, 4, 'Great but Expensive', 'Amazing phone with top-notch features, but the price is quite high. Camera is the best I have used.', true, NOW() - INTERVAL '5 days'),

-- Samsung Galaxy S24 Ultra Reviews
(2, 2, 5, 'S Pen is a Game Changer', 'The S Pen makes this phone incredibly productive. 200MP camera takes stunning photos!', true, NOW() - INTERVAL '12 days'),
(2, 5, 4, 'Excellent Android Flagship', 'Great performance, beautiful display, and amazing camera. Battery lasts all day easily.', true, NOW() - INTERVAL '8 days'),

-- OnePlus 12 Reviews
(3, 3, 5, 'Best Value Flagship', 'Amazing performance at this price point. 100W charging is incredibly fast!', true, NOW() - INTERVAL '20 days'),
(3, 6, 5, 'Hasselblad Camera Rocks', 'Camera quality is excellent, especially in good lighting. OxygenOS is smooth and clean.', true, NOW() - INTERVAL '14 days'),

-- MacBook Pro Reviews
(4, 2, 5, 'Perfect for Developers', 'M3 chip handles everything I throw at it. Battery life is incredible - easily lasts 15+ hours.', true, NOW() - INTERVAL '25 days'),
(4, 4, 5, 'Best Laptop I Have Owned', 'The display is gorgeous, performance is top-notch, and build quality is exceptional.', true, NOW() - INTERVAL '18 days'),

-- Dell XPS 15 Reviews
(5, 3, 5, 'Premium Windows Laptop', 'Beautiful 4K OLED display and powerful performance. Perfect for content creation.', true, NOW() - INTERVAL '22 days'),
(5, 5, 4, 'Great Build Quality', 'Solid laptop with excellent specs. Gets a bit warm under heavy load but overall great.', true, NOW() - INTERVAL '16 days'),

-- Sony WH-1000XM5 Reviews
(7, 2, 5, 'Best ANC Headphones', 'Noise cancellation is industry-leading. Sound quality is phenomenal and very comfortable.', true, NOW() - INTERVAL '30 days'),
(7, 3, 5, 'Worth the Premium Price', 'These headphones are perfect for travel and work. Battery life is excellent.', true, NOW() - INTERVAL '25 days'),
(7, 6, 5, 'Amazing Sound Quality', 'Crystal clear audio with deep bass. Multipoint connection works flawlessly.', true, NOW() - INTERVAL '20 days'),

-- AirPods Pro 2 Reviews
(8, 4, 5, 'Perfect for iPhone Users', 'Seamless integration with iPhone. Adaptive audio is a great feature.', true, NOW() - INTERVAL '18 days'),
(8, 5, 4, 'Great Earbuds', 'Sound quality is good and ANC works well. USB-C charging is convenient.', true, NOW() - INTERVAL '12 days'),

-- Levi's Jeans Reviews
(12, 2, 5, 'Perfect Fit', 'Slim fit is just right. Quality denim with good stretch. Very comfortable.', true, NOW() - INTERVAL '40 days'),
(12, 6, 4, 'Good Quality Jeans', 'Classic Levi''s quality. Fits well and looks great. Worth the price.', true, NOW() - INTERVAL '35 days'),

-- Nike T-Shirt Reviews
(13, 3, 5, 'Great for Workouts', 'Dri-FIT technology works perfectly. Keeps me dry during intense workouts.', true, NOW() - INTERVAL '28 days'),
(13, 5, 5, 'Comfortable and Breathable', 'Perfect athletic fit. Material is soft and breathable. Highly recommend!', true, NOW() - INTERVAL '22 days'),

-- Zara Dress Reviews
(15, 3, 5, 'Beautiful Dress', 'Floral print is gorgeous and the fit is perfect. Got many compliments!', true, NOW() - INTERVAL '15 days'),
(15, 5, 4, 'Great Summer Dress', 'Comfortable and stylish. Material is light and flowy. Perfect for summer.', true, NOW() - INTERVAL '10 days'),

-- Adidas Ultraboost Reviews
(18, 2, 5, 'Best Running Shoes', 'Boost cushioning is amazing. Very comfortable for long runs. Worth every rupee!', true, NOW() - INTERVAL '45 days'),
(18, 4, 5, 'Extremely Comfortable', 'Like walking on clouds. Great for running and everyday wear.', true, NOW() - INTERVAL '38 days'),

-- Nike Air Force 1 Reviews
(19, 3, 5, 'Classic Sneakers', 'Timeless design that goes with everything. Very comfortable and durable.', true, NOW() - INTERVAL '50 days'),
(19, 6, 5, 'Love These Shoes', 'Perfect casual sneakers. Quality is excellent and they look great.', true, NOW() - INTERVAL '42 days'),

-- Philips Air Fryer Reviews
(22, 2, 5, 'Healthy Cooking Made Easy', 'Makes crispy food with minimal oil. Very easy to use and clean.', true, NOW() - INTERVAL '60 days'),
(22, 4, 5, 'Best Kitchen Appliance', 'Use it almost daily. Food comes out perfect every time. Highly recommend!', true, NOW() - INTERVAL '55 days'),
(22, 5, 4, 'Great Air Fryer', 'Good capacity and cooks food evenly. Digital display is convenient.', true, NOW() - INTERVAL '48 days'),

-- Milton Flask Reviews
(23, 3, 5, 'Keeps Drinks Hot All Day', 'Temperature retention is excellent. Very durable and leak-proof.', true, NOW() - INTERVAL '70 days'),
(23, 6, 5, 'Best Flask', 'Keeps my tea hot for 24 hours. Great quality and value for money.', true, NOW() - INTERVAL '65 days'),

-- Lakme Lipstick Reviews
(26, 3, 5, 'Long-Lasting Color', 'Stays on for hours without fading. Love the matte finish!', true, NOW() - INTERVAL '25 days'),
(26, 5, 4, 'Good Lipstick', 'Nice color range and good staying power. Doesn''t dry out lips.', true, NOW() - INTERVAL '20 days'),

-- Gillette Razor Reviews
(28, 2, 5, 'Smooth Shave', 'Three blades give a very close shave. Lubrication strip works well.', true, NOW() - INTERVAL '35 days'),
(28, 4, 5, 'Best Razor', 'No irritation and very smooth shave. Blades last long.', true, NOW() - INTERVAL '30 days'),

-- Nivia Football Reviews
(31, 6, 5, 'Great Football', 'Good quality for the price. Durable and plays well on all surfaces.', true, NOW() - INTERVAL '80 days'),
(31, 2, 4, 'Value for Money', 'Decent football for practice and casual games. Good grip.', true, NOW() - INTERVAL '75 days'),

-- Atomic Habits Reviews
(36, 2, 5, 'Life-Changing Book', 'This book completely changed how I approach habits. Highly practical and easy to implement!', true, NOW() - INTERVAL '90 days'),
(36, 3, 5, 'Must Read', 'Best self-help book I have read. Clear strategies backed by science.', true, NOW() - INTERVAL '85 days'),
(36, 4, 5, 'Excellent Book', 'Very insightful and practical. Helped me build better habits.', true, NOW() - INTERVAL '80 days'),

-- LEGO Reviews
(41, 5, 5, 'Kids Love It', 'My children play with this for hours. Great for creativity!', true, NOW() - INTERVAL '100 days'),
(41, 6, 5, 'Quality Toy', 'LEGO quality is always top-notch. Endless building possibilities.', true, NOW() - INTERVAL '95 days'),

-- Monopoly Reviews
(44, 2, 5, 'Family Favorite', 'We play this every weekend. Great family bonding time!', true, NOW() - INTERVAL '120 days'),
(44, 4, 4, 'Classic Game', 'Timeless board game. Can get competitive but lots of fun!', true, NOW() - INTERVAL '115 days'),

-- Grocery Reviews
(46, 2, 5, 'Good Quality Oil', 'Light and healthy. Good for all types of cooking.', true, NOW() - INTERVAL '30 days'),
(47, 3, 5, 'Best Basmati Rice', 'Long grains and great aroma. Cooks perfectly every time.', true, NOW() - INTERVAL '28 days'),
(48, 4, 5, 'Strong Tea', 'Perfect morning tea. Rich flavor and aroma.', true, NOW() - INTERVAL '25 days'),
(49, 5, 4, 'Fresh Butter', 'Creamy and tasty. Good for toast and cooking.', true, NOW() - INTERVAL '20 days'),
(50, 6, 5, 'Quick and Tasty', 'Perfect for quick snacks. Kids love it!', true, NOW() - INTERVAL '15 days');

-- =====================================================
-- 14. REFERRALS
-- =====================================================
INSERT INTO referrals (user_id, referral_code, created_at) VALUES
(2, 'RAJESH2024', NOW() - INTERVAL '90 days'),
(3, 'PRIYA2024', NOW() - INTERVAL '85 days'),
(4, 'AMIT2024', NOW() - INTERVAL '80 days'),
(5, 'SNEHA2024', NOW() - INTERVAL '75 days'),
(6, 'VIKRAM2024', NOW() - INTERVAL '70 days');

-- =====================================================
-- 15. WISHLIST ITEMS
-- =====================================================
INSERT INTO wishlist_items (user_id, product_id, created_at) VALUES
(2, 1, NOW() - INTERVAL '5 days'),
(2, 4, NOW() - INTERVAL '10 days'),
(2, 7, NOW() - INTERVAL '15 days'),
(3, 2, NOW() - INTERVAL '7 days'),
(3, 15, NOW() - INTERVAL '12 days'),
(3, 22, NOW() - INTERVAL '20 days'),
(4, 5, NOW() - INTERVAL '8 days'),
(4, 18, NOW() - INTERVAL '14 days'),
(5, 10, NOW() - INTERVAL '6 days'),
(5, 26, NOW() - INTERVAL '11 days'),
(6, 3, NOW() - INTERVAL '9 days'),
(6, 31, NOW() - INTERVAL '16 days');

-- =====================================================
-- SUMMARY
-- =====================================================
-- This seed data includes:
-- ✅ 6 Users (1 admin + 5 customers)
-- ✅ 5 User Addresses
-- ✅ 16 Categories (8 main + 8 subcategories)
-- ✅ 51 Products across all categories
-- ✅ 150+ Product Variants (colors, sizes, storage options)
-- ✅ 50+ Reviews from verified purchases
-- ✅ 5 Referral codes
-- ✅ 12 Wishlist items
-- 
-- Categories covered:
-- - Electronics (Smartphones, Laptops, Headphones, Cameras)
-- - Fashion (Men's/Women's Clothing, Footwear, Accessories)
-- - Home & Kitchen (Appliances, Cookware, Storage)
-- - Beauty & Personal Care (Cosmetics, Skincare, Grooming)
-- - Sports & Fitness (Equipment, Yoga, Gym)
-- - Books & Stationery (Books, Notebooks, Pens)
-- - Toys & Games (LEGO, Board Games, Action Figures)
-- - Groceries (Food items, Daily essentials)