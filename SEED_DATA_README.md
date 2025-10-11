# 🌱 Database Seed Data Guide

This guide explains how to populate your Blinkeach E-commerce database with comprehensive sample data.

## 📦 What's Included

### **Users (6 total)**
- **1 Admin Account**
  - Username: `admin`
  - Email: `admin@blinkeach.com`
  - Password: `password123`

- **5 Customer Accounts**
  - `rajesh_kumar` - Bangalore, Karnataka
  - `priya_sharma` - Kolkata, West Bengal
  - `amit_patel` - Ahmedabad, Gujarat
  - `sneha_reddy` - Hyderabad, Telangana
  - `vikram_singh` - New Delhi, Delhi
  - Password: `password123` (for all)

### **Categories (16 total)**
#### Main Categories (8):
1. **Electronics** - Latest gadgets and devices
2. **Fashion** - Clothing and accessories
3. **Home & Kitchen** - Appliances and cookware
4. **Beauty & Personal Care** - Cosmetics and grooming
5. **Sports & Fitness** - Equipment and gear
6. **Books & Stationery** - Books and office supplies
7. **Toys & Games** - Fun for all ages
8. **Groceries** - Daily essentials

#### Subcategories (8):
- Smartphones, Laptops, Headphones, Cameras
- Men's Clothing, Women's Clothing, Footwear, Accessories

### **Products (51 total)**

#### Electronics (10 products)
- **Smartphones**: iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, OnePlus 12
- **Laptops**: MacBook Pro 14" M3, Dell XPS 15, ASUS ROG Strix G16
- **Headphones**: Sony WH-1000XM5, Apple AirPods Pro 2, JBL Tune 760NC
- **Cameras**: Canon EOS R6 Mark II, Sony Alpha A7 IV

#### Fashion (9 products)
- **Men's Clothing**: Levi's 511 Jeans, Nike Dri-FIT T-Shirt, Allen Solly Formal Shirt
- **Women's Clothing**: Zara Floral Maxi Dress, H&M High-Waisted Jeans, Forever 21 Crop Top
- **Footwear**: Adidas Ultraboost 23, Nike Air Force 1, Bata Formal Shoes

#### Home & Kitchen (5 products)
- Prestige Induction Cooktop, Philips Air Fryer, Milton Thermosteel Flask
- Cello Storage Container Set, Havells Ceiling Fan

#### Beauty & Personal Care (5 products)
- Lakme Absolute Lipstick, Neutrogena Face Wash, Gillette Mach3 Razor
- Dove Body Lotion, Philips Trimmer

#### Sports & Fitness (5 products)
- Nivia Storm Football, Cosco Yoga Mat, Strauss Adjustable Dumbbells
- Yonex Badminton Racket, Decathlon Resistance Bands Set

#### Books & Stationery (5 products)
- Atomic Habits by James Clear, Classmate Notebook Bundle, Parker Jotter Pen
- Faber-Castell Art Set, HP DeskJet Printer Paper

#### Toys & Games (5 products)
- LEGO Classic Creative Bricks, Hot Wheels 5-Car Pack, Barbie Dreamhouse Doll
- Monopoly Board Game, Rubik's Cube 3x3

#### Groceries (6 products)
- Fortune Sunflower Oil, India Gate Basmati Rice, Tata Tea Premium
- Amul Butter, Maggi 2-Minute Noodles, Britannia Good Day Cookies

### **Product Variants (150+ total)**
Products with multiple color, size, and storage options:
- **Smartphones**: Different colors and storage capacities
- **Clothing**: Multiple sizes (S, M, L, XL) and colors
- **Footwear**: UK sizes 7-10 in various colors
- **Headphones**: Different color options
- **Lipstick**: 6 different shades

### **Reviews (50+ total)**
- Verified purchase reviews from customers
- Ratings from 4 to 5 stars
- Detailed comments about product quality and experience

### **Other Data**
- **5 User Addresses** - Multiple delivery addresses
- **5 Referral Codes** - One for each customer
- **12 Wishlist Items** - Products saved by customers

---

## 🚀 How to Seed the Database

### Method 1: Using Node.js Script (Recommended)

1. **Make sure your database is running and connected**
   ```bash
   # Test connection first
   node test-db-connection.js
   ```

2. **Run the seed script**
   ```bash
   node seed-database.js
   ```

3. **Wait for completion**
   - The script will show progress for each step
   - You'll see a summary of all inserted data
   - Total time: ~10-30 seconds

### Method 2: Using pgAdmin or Database Client

1. **Open pgAdmin 4** and connect to your Neon database

2. **Open Query Tool** (Tools → Query Tool)

3. **Execute Part 1**
   - Open `seed-database.sql`
   - Copy all content
   - Paste in Query Tool
   - Click Execute (F5)

4. **Execute Part 2**
   - Open `seed-database-part2.sql`
   - Copy all content
   - Paste in Query Tool
   - Click Execute (F5)

### Method 3: Using psql Command Line

```bash
# Connect to your database
psql "postgresql://neondb_owner:npg_p3bZMs8DyHLd@ep-flat-rain-adilyyl7-pooler.c-2.us-east-1.aws.neon.tech/blinkeach?sslmode=require"

# Execute SQL files
\i seed-database.sql
\i seed-database-part2.sql
```

---

## ✅ Verification

After seeding, verify the data:

```sql
-- Check counts
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Product Variants', COUNT(*) FROM product_variants
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'Wishlist Items', COUNT(*) FROM wishlist_items;
```

Expected results:
- Users: 6
- Categories: 16
- Products: 51
- Product Variants: 150+
- Reviews: 50+
- Wishlist Items: 12

---

## 🔐 Test Login Credentials

### Admin Account
```
Username: admin
Email: admin@blinkeach.com
Password: password123
```

### Customer Accounts
```
Username: rajesh_kumar
Email: rajesh.kumar@gmail.com
Password: password123

Username: priya_sharma
Email: priya.sharma@gmail.com
Password: password123

Username: amit_patel
Email: amit.patel@gmail.com
Password: password123

Username: sneha_reddy
Email: sneha.reddy@gmail.com
Password: password123

Username: vikram_singh
Email: vikram.singh@gmail.com
Password: password123
```

---

## 📊 Product Details

### Price Ranges
- **Budget**: ₹99 - ₹999 (Groceries, Stationery, Beauty)
- **Mid-Range**: ₹1,000 - ₹9,999 (Fashion, Home & Kitchen, Sports)
- **Premium**: ₹10,000 - ₹50,000 (Electronics, Laptops)
- **Luxury**: ₹50,000+ (iPhone 15 Pro Max, MacBook Pro)

### Stock Levels
- All products have adequate stock (15-800 units)
- Variants have individual stock tracking
- Popular items have higher stock levels

### Tax Configuration
- **Electronics**: 18% GST (9% SGST + 9% CGST)
- **Fashion**: 12% GST (6% SGST + 6% CGST)
- **Groceries**: 5% GST (2.5% SGST + 2.5% CGST)
- **Books**: 0% GST (exempt)

---

## 🎨 Product Images

All products use high-quality Unsplash images:
- Professional product photography
- Consistent styling and quality
- Optimized for web display
- Multiple images per product

---

## 🔄 Re-seeding the Database

If you need to reset and re-seed:

```bash
# This will clear all existing data and insert fresh seed data
node seed-database.js
```

**⚠️ Warning**: This will delete ALL existing data including:
- Orders
- Cart items
- User-generated reviews
- Custom user data

---

## 📝 Customization

### Adding More Products

Edit `seed-database.sql` and add new INSERT statements:

```sql
INSERT INTO products (name, description, price, ...) VALUES
('Your Product Name', 'Description', 9999, ...);
```

### Adding Product Variants

Edit `seed-database-part2.sql`:

```sql
INSERT INTO product_variants (product_id, color_name, color_value, size_name, stock, sku) VALUES
(product_id, 'Red', '#FF0000', 'M', 50, 'SKU-RED-M');
```

### Modifying User Data

Edit the users section in `seed-database.sql`:

```sql
INSERT INTO users (username, password, email, full_name, ...) VALUES
('new_user', '$2b$12$...', 'email@example.com', 'Full Name', ...);
```

---

## 🐛 Troubleshooting

### Error: "duplicate key value violates unique constraint"
**Solution**: The database already has data. Run the TRUNCATE commands first or use the seed script which handles this automatically.

### Error: "relation does not exist"
**Solution**: Run `npm run db:push` first to create all tables.

### Error: "connection refused"
**Solution**: Check your DATABASE_URL in `.env` file and ensure the database is running.

### Error: "permission denied"
**Solution**: Ensure your database user has INSERT permissions.

---

## 📚 Next Steps

After seeding:

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Test the application**
   - Browse products by category
   - Add items to cart
   - Test user login
   - Create test orders

3. **Explore the admin panel**
   - Login with admin credentials
   - View all products
   - Manage orders
   - Check analytics

---

## 💡 Tips

- **Use realistic data**: All products have real-world pricing and specifications
- **Test different scenarios**: Multiple users, various product types, different price ranges
- **Check relationships**: Products → Variants, Users → Reviews, etc.
- **Verify images**: All image URLs should load properly
- **Test search**: Products have detailed descriptions for search functionality

---

## 📞 Support

If you encounter any issues:
1. Check the console output for error messages
2. Verify your database connection
3. Ensure all tables are created (`npm run db:push`)
4. Check the SQL syntax in the seed files

---

**Happy Testing! 🎉**

Your Blinkeach E-commerce database is now fully populated with realistic data across all categories!