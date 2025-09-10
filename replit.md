# Blinkeach E-commerce Platform

## Overview

Blinkeach is a full-stack e-commerce platform built with React frontend and Express.js backend. It's designed as a comprehensive online marketplace with features including product catalog, shopping cart, payment processing, user authentication, admin panel, and multi-language support.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state management
- **UI Framework**: Radix UI components with Tailwind CSS styling
- **Build Tool**: Vite for fast development and optimized builds
- **Internationalization**: i18next for multi-language support (English, Hindi, Telugu, Marathi, Bengali)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with local, Google, and Facebook strategies
- **Session Management**: JWT tokens for stateless authentication
- **Database ORM**: Drizzle ORM for type-safe database operations
- **File Uploads**: Multer for handling product images and 3D models
- **Real-time Features**: WebSocket support for live chat and admin notifications

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Key Tables**: Users, Products, Orders, Categories, Reviews, Cart Items, Addresses, Support Requests

## Key Components

### Authentication System
- Multi-provider authentication (Local, Google, Facebook)
- Email OTP verification for registration
- Password reset functionality
- Role-based access control (Admin/User)
- JWT-based session management

### Product Management
- Category-based product organization
- Product variants (colors, sizes)
- Image gallery with 3D model support
- Advanced search and filtering
- Product reviews and ratings
- Wishlist functionality

### E-commerce Features
- Shopping cart with persistent storage
- Multi-address management
- Order tracking and management
- Payment integration with Razorpay
- Return and refund processing
- Inventory management
- ₹40 standard delivery charge with universal discount system
- 18% GST calculations on all transactions
- Universal ₹40 discount applied to all users regardless of order amount (effectively free delivery for everyone)

### Admin Panel
- Dashboard with sales analytics
- Product, category, and user management
- Order processing and status updates
- Real-time notifications system
- Support ticket management

### Customer Support
- Live chat system with WebSocket
- Multilingual chatbot
- Callback request system
- Contact form with email notifications
- Support ticket tracking

## Data Flow

### User Registration/Authentication Flow
1. User submits registration form
2. System validates data and sends OTP via email
3. User verifies OTP to activate account
4. JWT token issued for authenticated sessions
5. User profile and preferences stored

### Order Processing Flow
1. User adds products to cart
2. Checkout process with address selection
3. Payment processing through Razorpay
4. Order confirmation and inventory update
5. Admin notification and order fulfillment
6. Delivery tracking and completion

### Product Search and Discovery
1. Search queries processed with fuzzy matching
2. Category-based filtering applied
3. Results sorted by relevance and user preferences
4. Product recommendations based on browsing history

## External Dependencies

### Payment Processing
- **Razorpay**: Primary payment gateway for Indian market
- Supports UPI, cards, net banking, and wallets
- Test mode integration implemented

### Email Services
- **SendGrid**: Transactional email delivery
- **Gmail API**: Alternative email service for notifications
- Email templates for order confirmations and OTP verification

### Cloud Storage
- **Local Storage**: Product images and uploads stored locally
- **Placeholder Services**: Unsplash and placeholder.com for demo images

### Third-party Integrations
- **Google OAuth**: Social login integration
- **Facebook OAuth**: Social authentication
- **i18next**: Internationalization and localization
- **Delhivery API**: Real-time shipment creation and tracking integration
- **Multiple Courier Partners**: Support for Delhivery, Ekart, Blue Dart, and custom delivery services

## Deployment Strategy

### Development Environment
- Replit-based development with hot reload
- Vite dev server for frontend development
- Express server with TypeScript compilation
- Environment variables for configuration

### Production Considerations
- Neon PostgreSQL for production database
- Static file serving through Express
- Environment-specific configuration
- Error handling and logging middleware

### Database Management
- Drizzle migrations for schema updates
- Seed scripts for initial data population
- Connection pooling for performance optimization

## Changelog
- August 26, 2025: Fixed critical color name input field issue in admin product form - input field now accepts text properly
- August 26, 2025: Implemented robust form validation cleanup to handle empty color/size entries before submission
- August 26, 2025: Enhanced color input handling with direct state updates and automatic color value mapping
- August 26, 2025: Verified product creation with color variants working correctly (Red/Pink colors with multiple sizes)
- August 19, 2025: Removed all test/mock data from database and connected all components to authentic data sources
- August 19, 2025: Fixed database schema issues with products and carousel_images tables - added missing columns
- August 19, 2025: Resolved top-selling products query error by simplifying GROUP BY clause
- August 19, 2025: Created and populated carousel_images table with proper structure and sample data
- August 19, 2025: Verified all API endpoints working with real database data (5 products, 29 orders, 4 users)
- August 14, 2025: Prepared platform for Render deployment with comprehensive configuration files and deployment guide
- August 14, 2025: Created render.yaml, Dockerfile, and deployment documentation for production hosting
- August 14, 2025: Cleaned up attached_assets directory by removing 200+ unnecessary files and duplicates
- August 14, 2025: Updated browserslist database and resolved SSL database connection requirements
- January 14, 2025: Integrated Delhivery delivery API with real-time shipment creation and tracking
- January 14, 2025: Added delivery service with support for multiple courier partners (Delhivery, Ekart, Blue Dart)
- January 14, 2025: Enhanced orders table with tracking_id and tracking_url fields for shipment management
- January 14, 2025: Created comprehensive delivery API endpoints for admin shipment creation and public tracking
- January 14, 2025: Implemented secure API key management using Replit Secrets for delivery services
- January 14, 2025: Enhanced "View All" buttons across product sections with consistent gradient styling
- January 14, 2025: Updated return policy from 30-day to 7-day return window in FAQ and policies
- July 18, 2025: Implemented comprehensive quantity unit system with dropdown selection and numeric input for product management
- July 18, 2025: Added quantity_unit and quantity_per_unit fields to products table with 12 different unit options
- July 18, 2025: Enhanced admin product form with quantity unit configuration section and proper validation
- July 18, 2025: Updated database schema to support flexible quantity units (kg, pcs, grams, liters, etc.)
- August 18, 2025: Completely removed 18% GST calculations from entire platform per user request
- August 18, 2025: Updated all payment flows, cart summaries, checkout pages, and invoice generators to exclude GST
- August 18, 2025: Simplified pricing structure - subtotal + ₹40 delivery - ₹40 universal discount = final amount
- August 18, 2025: Verified live Razorpay payment processing works correctly without GST calculations
- August 18, 2025: Fixed Buy Now payment integration - properly calculates amounts and redirects to live Razorpay gateway
- August 18, 2025: Updated payment UI from "Test Mode" to "Live Payment Mode" with green success styling
- August 18, 2025: Resolved payment amount display issues showing ₹0.00 - now correctly shows product amounts
- August 18, 2025: Fixed admin panel data integrity issues - replaced fake sample data with real database records
- August 18, 2025: Enhanced invoice upload system with professional file icons, compact design, and full delete functionality
- August 18, 2025: Implemented complete invoice management with cloud storage cleanup and database synchronization
- August 18, 2025: Fixed user order loading authentication issues - added proper middleware to /api/orders/user endpoint
- August 18, 2025: Verified all database connections working properly with 21+ orders and 3+ customer accounts
- July 10, 2025: Implemented product-specific GST system with IGST, CGST, and SGST fields (now disabled)
- July 10, 2025: Updated invoice calculations to use actual database GST rates instead of hardcoded values (now disabled)
- July 10, 2025: Added three GST input fields to admin product form with default value 0 (now set to 0)
- July 10, 2025: Enhanced invoice generator to match exact user reference format with dynamic calculations (now without GST)
- July 10, 2025: Updated database schema to include product-specific GST rates with proper validation (now unused)
- June 29, 2025: Implemented universal discount system - ₹40 discount for all users regardless of order amount
- June 29, 2025: Added comprehensive discount calculation sections to invoices, cart summary, and checkout pages
- June 29, 2025: Updated pricing structure to show total amount - delivery charge + GST breakdown
- June 29, 2025: Enhanced invoice UI/UX with modern gradient design and professional layout
- June 29, 2025: Updated shipping policy and FAQ documentation to reflect new pricing structure
- June 29, 2025: Fixed carousel image cropping issues for better visual presentation
- June 29, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.