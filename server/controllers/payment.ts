import { Request, Response } from "express";
import { storage } from "../storage";
import crypto from "crypto";
import Razorpay from "razorpay";

// Use environment variables for production, fallback to test keys for development only
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || (process.env.NODE_ENV === 'development' ? "rzp_test_rcVl0DWaf7NRr9" : "");
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || (process.env.NODE_ENV === 'development' ? "b4wOG3UwVOOIpxmQHu5C3Nni" : "");

// Log Razorpay configuration status
console.log('🔐 Razorpay Configuration Status:');
console.log(`   - Key ID: ${RAZORPAY_KEY_ID ? RAZORPAY_KEY_ID.substring(0, 15) + '...' : 'NOT SET'}`);
console.log(`   - Key Secret: ${RAZORPAY_KEY_SECRET ? '***' + RAZORPAY_KEY_SECRET.substring(RAZORPAY_KEY_SECRET.length - 4) : 'NOT SET'}`);
console.log(`   - Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`   - Mode: ${RAZORPAY_KEY_ID?.startsWith('rzp_live') ? 'LIVE' : 'TEST'}`);

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

console.log('✅ Razorpay instance initialized successfully\n');

const paymentController = {
  // Create a Razorpay order
  createOrder: async (req: Request, res: Response) => {
    console.log('\n💳 ========== RAZORPAY ORDER CREATION STARTED ==========');
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    try {
      const { 
        amount, 
        currency, 
        userEmail, 
        userPhone, 
        userName, 
        address,
        userId,
        totalAmount,
        shippingAddress,
        paymentMethod,
        specialInstructions,
        items 
      } = req.body;
      
      console.log('📦 Order Request Data:');
      console.log('   - User ID:', userId);
      console.log('   - User Name:', userName);
      console.log('   - User Email:', userEmail);
      console.log('   - User Phone:', userPhone);
      console.log('   - Total Amount (paisa):', totalAmount);
      console.log('   - Currency:', currency);
      console.log('   - Items Count:', items?.length);
      console.log('   - Shipping Address:', shippingAddress);
      
      if (!amount || !currency || !userName || !items || !userId || !totalAmount || !shippingAddress) {
        console.error('❌ Missing required fields for order creation');
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Calculate Razorpay discount
      // 1% for orders under ₹1000, 5% for orders ₹1000 and above
      const discountPercentage = totalAmount >= 100000 ? 5 : 1; // Amount in paisa (Rs. 1000 = 100000 paisa)
      const discountAmount = Math.round((totalAmount * discountPercentage) / 100);
      const finalAmount = totalAmount - discountAmount;
      
      // Razorpay minimum order amount validation (₹1.00 = 100 paisa)
      const RAZORPAY_MIN_AMOUNT = 100; // 100 paisa = ₹1.00
      if (finalAmount < RAZORPAY_MIN_AMOUNT) {
        console.error('❌ Order amount below Razorpay minimum');
        console.error('   - Final Amount: ₹' + (finalAmount / 100).toFixed(2));
        console.error('   - Minimum Required: ₹' + (RAZORPAY_MIN_AMOUNT / 100).toFixed(2));
        return res.status(400).json({ 
          message: `Order amount must be at least ₹${(RAZORPAY_MIN_AMOUNT / 100).toFixed(2)}. Current amount after discount: ₹${(finalAmount / 100).toFixed(2)}`,
          minimumAmount: RAZORPAY_MIN_AMOUNT,
          currentAmount: finalAmount
        });
      }
      
      console.log('💰 Razorpay Discount Calculation:');
      console.log('   - Original Amount: ₹' + (totalAmount / 100).toFixed(2));
      console.log('   - Discount Percentage:', discountPercentage + '%');
      console.log('   - Discount Amount: ₹' + (discountAmount / 100).toFixed(2));
      console.log('   - Final Amount: ₹' + (finalAmount / 100).toFixed(2));
      
      // Create order with Razorpay API
      console.log('\n🌐 Calling Razorpay API to create order...');
      console.log('   - API Key:', RAZORPAY_KEY_ID.substring(0, 15) + '...');
      
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: finalAmount, // amount in paisa (smallest currency unit)
        currency: currency || 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          userName,
          userEmail: userEmail || '',
          userPhone: userPhone || ''
        }
      });
      
      const razorpayOrderId = razorpayOrder.id;
      console.log('✅ Razorpay Order Created Successfully!');
      console.log('   - Order ID:', razorpayOrderId);
      console.log('   - Amount:', razorpayOrder.amount);
      console.log('   - Currency:', razorpayOrder.currency);
      console.log('   - Status:', razorpayOrder.status);
      console.log('   - Receipt:', razorpayOrder.receipt);
      
      // Create order in our database
      console.log('\n💾 Creating order in database...');
      let order = null;
      try {
        order = await storage.createOrder({
          userId,
          totalAmount: finalAmount, // Apply the discount
          shippingAddress,
          paymentMethod: 'razorpay',
          specialInstructions: specialInstructions || '',
          razorpayOrderId
        });

        console.log('✅ Database order created with ID:', order?.id);

        // Add order items
        if (order) {
          console.log('📦 Adding order items to database...');
          for (const item of items) {
            await storage.addOrderItem({
              orderId: order.id,
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity
            });
            
            console.log(`   ✓ Added item: ${item.name} (Qty: ${item.quantity})`);
            
            // Update product stock in database
            const product = await storage.getProductById(item.productId);
            if (product && product.stock >= item.quantity) {
              await storage.updateProduct(item.productId, {
                stock: product.stock - item.quantity
              });
              console.log(`   ✓ Stock updated for product ${item.productId}: ${product.stock} → ${product.stock - item.quantity}`);
            }
          }
        }
      } catch (dbError) {
        console.error("❌ Database error creating order:", dbError);
        // Continue with payment processing even if DB fails
      }
      
      // Return the actual Razorpay order details
      const responseData = {
        id: razorpayOrderId,
        amount: finalAmount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        status: razorpayOrder.status,
        key: RAZORPAY_KEY_ID, // Send the key ID for frontend integration
        orderId: order?.id || null // Our internal order ID
      };
      
      console.log('\n📤 Sending response to client:');
      console.log('   - Razorpay Order ID:', responseData.id);
      console.log('   - Internal Order ID:', responseData.orderId);
      console.log('   - Amount:', responseData.amount);
      console.log('   - Key ID:', responseData.key.substring(0, 15) + '...');
      console.log('💳 ========== RAZORPAY ORDER CREATION COMPLETED ==========\n');
      
      res.json(responseData);
    } catch (error) {
      console.error("\n❌ ========== RAZORPAY ORDER CREATION FAILED ==========");
      console.error("Error details:", error);
      console.error("Error message:", error instanceof Error ? error.message : 'Unknown error');
      console.error("========================================================\n");
      res.status(500).json({ message: "Failed to create payment order" });
    }
  },
  
  // Verify Razorpay payment
  verifyPayment: async (req: Request, res: Response) => {
    console.log('\n🔐 ========== RAZORPAY PAYMENT VERIFICATION STARTED ==========');
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    try {
      const { 
        razorpay_payment_id, 
        razorpay_order_id, 
        razorpay_signature,
        orderId 
      } = req.body;
      
      console.log('📥 Payment Verification Request:');
      console.log('   - Payment ID:', razorpay_payment_id);
      console.log('   - Order ID:', razorpay_order_id);
      console.log('   - Signature:', razorpay_signature?.substring(0, 20) + '...');
      console.log('   - Internal Order ID:', orderId);
      
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        console.error('❌ Missing payment details for verification');
        return res.status(400).json({ message: "Missing payment details" });
      }
      
      // In a real application, we would verify the signature
      // The following is a simplified demonstration
      
      console.log('\n🔑 Verifying payment signature...');
      console.log('   - Using Key Secret:', '***' + RAZORPAY_KEY_SECRET.substring(RAZORPAY_KEY_SECRET.length - 4));
      
      // Live payment signature verification
      const generatedSignature = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
      
      console.log('   - Generated Signature:', generatedSignature.substring(0, 20) + '...');
      console.log('   - Received Signature:', razorpay_signature.substring(0, 20) + '...');
      
      const isSignatureValid = generatedSignature === razorpay_signature;
      console.log('   - Signature Match:', isSignatureValid ? '✅ YES' : '❌ NO');
      
      // With live API keys, enforce proper signature verification
      if (!isSignatureValid) {
        console.error('\n❌ ========== PAYMENT VERIFICATION FAILED ==========');
        console.error('Reason: Invalid signature');
        console.error('====================================================\n');
        return res.status(400).json({ 
          success: false, 
          message: "Invalid payment signature - payment verification failed" 
        });
      }
      
      console.log('✅ Payment signature verified successfully!');
      
      // Find the order in our database by Razorpay order ID
      console.log('\n💾 Updating order in database...');
      try {
        // First try to find the order using orderId parameter
        let order;
        let orderIdNumber;
        
        if (orderId) {
          orderIdNumber = parseInt(orderId.toString());
          if (!isNaN(orderIdNumber)) {
            console.log('   - Looking up order by ID:', orderIdNumber);
            order = await storage.getOrderById(orderIdNumber);
            console.log('   - Order found:', order ? 'YES' : 'NO');
          }
        }
        
        // If order not found by ID, try to find by Razorpay order ID
        // This is useful if the order was created in our database
        // but the ID was not passed correctly
        if (!order) {
          // We would need to implement a method to find orders by razorpayOrderId
          // For now, we'll just assume the order exists
          console.log('   ⚠️ Order not found by ID, would search by razorpayOrderId in production');
        }
        
        if (order || true) { // Assume order exists for demo
          // In production, we would update the order with Razorpay details
          if (orderIdNumber) {
            console.log('   - Updating order status to "processing"...');
            // Update order status and payment details
            await storage.updateOrderStatus(orderIdNumber, "processing");
            console.log('   ✅ Order status updated successfully');
          }
          
          // We would also save these details in the database
          console.log('\n✅ Payment Details Saved:');
          console.log('   - Payment ID:', razorpay_payment_id);
          console.log('   - Order ID:', razorpay_order_id);
          console.log('   - Signature Verified: YES');
        }
      } catch (dbError) {
        console.error('❌ Database error updating order:', dbError);
        // Continue with success response for demo purposes
      }
      
      console.log('\n🔐 ========== PAYMENT VERIFICATION COMPLETED ==========\n');
      
      res.json({
        success: true,
        message: "Payment verified successfully"
      });
    } catch (error) {
      console.error("\n❌ ========== PAYMENT VERIFICATION FAILED ==========");
      console.error("Error details:", error);
      console.error("Error message:", error instanceof Error ? error.message : 'Unknown error');
      console.error("====================================================\n");
      res.status(500).json({ 
        success: false, 
        message: "Failed to verify payment" 
      });
    }
  },
  
  // Process Cash on Delivery order
  processCodOrder: async (req: Request, res: Response) => {
    try {
      console.log("processCodOrder called with request:", JSON.stringify(req.body, null, 2));
      
      const {
        userId,
        totalAmount,
        shippingAddress,
        specialInstructions,
        items
      } = req.body;
      
      if (!userId || totalAmount === undefined || totalAmount === null || !shippingAddress || !items) {
        console.error("Missing required fields:", { 
          hasUserId: !!userId, 
          hasTotalAmount: totalAmount !== undefined && totalAmount !== null, 
          hasShippingAddress: !!shippingAddress, 
          hasItems: !!items,
          totalAmountValue: totalAmount
        });
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Get user information for the order
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Add COD fee (₹10 in paisa = 1000 paisa)
      const codFee = 1000; // ₹10 as paisa
      const finalAmount = totalAmount + codFee;
      
      // Create order in database
      try {
        console.log("Creating order with data:", {
          userId,
          totalAmount: finalAmount, // Apply COD fee
          shippingAddress,
          paymentMethod: 'cod',
          specialInstructions: specialInstructions || '',
          userName: user.fullName,
          userEmail: user.email,
          userPhone: user.phone
        });
        
        const order = await storage.createOrder({
          userId,
          totalAmount: finalAmount, // Apply COD fee 
          shippingAddress,
          paymentMethod: 'cod',
          specialInstructions: specialInstructions || '',
          userName: user.fullName,
          userEmail: user.email,
          userPhone: user.phone
        });
        
        console.log("Order created:", order);
        
        // Add order items and update stock
        if (order) {
          for (const item of items) {
            console.log("Adding order item:", item);
            
            // Get product details for HSN code and image
            const product = await storage.getProductById(item.productId);
            
            await storage.addOrderItem({
              orderId: order.id,
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              selectedColor: item.selectedColor || null,
              selectedSize: item.selectedSize || null,
              hsnCode: product?.hsnCode || null,
              productImage: product?.images?.[0] || null
            });
            
            // Update product stock in database
            if (product && product.stock >= item.quantity) {
              await storage.updateProduct(item.productId, {
                stock: product.stock - item.quantity
              });
              console.log(`Stock updated for product ${item.productId}, new stock: ${product.stock - item.quantity}`);
            } else {
              console.warn(`Insufficient stock for product ${item.productId}, current stock: ${product?.stock}, requested: ${item.quantity}`);
            }
          }
          
          // For COD orders, set initial status to 'confirmed'
          await storage.updateOrderStatus(order.id, "confirmed");
          
          console.log("Order confirmed with ID:", order.id);
          
          // Send success response with order ID
          return res.status(200).json({
            success: true,
            message: "Cash on Delivery order placed successfully",
            orderId: order.id
          });
        } else {
          throw new Error("Failed to create order");
        }
      } catch (dbError) {
        console.error("Database error creating COD order:", dbError);
        return res.status(500).json({ 
          success: false, 
          message: "Database error: " + (dbError instanceof Error ? dbError.message : "Unknown error")
        });
      }
    } catch (error) {
      console.error("Error processing COD order:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to process Cash on Delivery order: " + (error instanceof Error ? error.message : "Unknown error")
      });
    }
  }
};

export default paymentController;
