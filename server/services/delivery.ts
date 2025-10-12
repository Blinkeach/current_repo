import { Order } from '@shared/schema';

// Delivery service configuration
interface DeliveryConfig {
  apiKey: string;
  baseUrl: string;
  webhook: string;
  serviceName: string;
  trackingUrlTemplate: string;
}

// Delivery partner options
type DeliveryPartner = 'delhivery' | 'ekart' | 'bluedart' | 'express' | 'custom';

// Delivery request parameters
interface DeliveryRequest {
  orderId: number;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  deliveryAddress: string;
  city: string;
  state: string;
  pincode: string;
  weight: number; // in kg
  dimensions?: {
    length: number; // in cm
    width: number; // in cm
    height: number; // in cm
  };
  orderValue: number; // in paise
  isCod: boolean;
  items: Array<{
    name: string;
    quantity: number;
    price: number; // in paise
  }>;
}

// Delivery response from courier partner
interface DeliveryResponse {
  success: boolean;
  trackingId?: string;
  trackingUrl?: string;
  estimatedDelivery?: Date;
  message?: string;
  errors?: string[];
}

// Default delivery configuration
const defaultConfig: Record<DeliveryPartner, DeliveryConfig> = {
  delhivery: {
    apiKey: process.env.DELHIVERY_API_KEY || '',
    baseUrl: 'https://track.delhivery.com/api',
    webhook: '/webhooks/delhivery',
    serviceName: 'Delhivery',
    trackingUrlTemplate: 'https://track.delhivery.com/p/{trackingId}'
  },
  ekart: {
    apiKey: process.env.EKART_API_KEY || '',
    baseUrl: 'https://ekart-api.flipkart.com/api',
    webhook: '/webhooks/ekart',
    serviceName: 'Ekart Logistics',
    trackingUrlTemplate: 'https://ekartlogistics.com/shipmentTracking/{trackingId}'
  },
  bluedart: {
    apiKey: process.env.BLUEDART_API_KEY || '',
    baseUrl: 'https://api.bluedart.com',
    webhook: '/webhooks/bluedart',
    serviceName: 'Blue Dart',
    trackingUrlTemplate: 'https://www.bluedart.com/tracking/{trackingId}'
  },
  express: {
    apiKey: process.env.EXPRESS_API_KEY || '',
    baseUrl: 'https://express.api.com',
    webhook: '/webhooks/express',
    serviceName: 'Express Delivery',
    trackingUrlTemplate: 'https://track.expressdelivery.in/{trackingId}'
  },
  custom: {
    apiKey: process.env.CUSTOM_DELIVERY_API_KEY || '',
    baseUrl: process.env.CUSTOM_DELIVERY_BASE_URL || '',
    webhook: '/webhooks/custom',
    serviceName: process.env.CUSTOM_DELIVERY_NAME || 'Custom Delivery',
    trackingUrlTemplate: process.env.CUSTOM_DELIVERY_TRACKING_URL || 'https://track.delivery.com/{trackingId}'
  }
};

// Main delivery service class
export class DeliveryService {
  private config: DeliveryConfig;
  private partner: DeliveryPartner;
  
  constructor(partner: DeliveryPartner = 'delhivery') {
    console.log('\n📦 ========== DELIVERY SERVICE INITIALIZATION ==========');
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    this.partner = partner;
    this.config = defaultConfig[partner];
    
    console.log('🚚 Delivery Configuration:');
    console.log('   - Partner:', this.partner);
    console.log('   - Service Name:', this.config.serviceName);
    console.log('   - Base URL:', this.config.baseUrl);
    console.log('   - API Key:', this.config.apiKey ? '***' + this.config.apiKey.substring(this.config.apiKey.length - 8) : 'NOT SET');
    
    // Check if the API key is set
    if (!this.config.apiKey) {
      console.warn(`⚠️ ${this.config.serviceName} API key is not set. Using mock delivery service for development.`);
    } else {
      console.log(`✅ ${this.config.serviceName} API key configured successfully`);
    }
    console.log('📦 ====================================================\n');
  }
  
  /**
   * Create a delivery shipment for an order
   */
  async createShipment(request: DeliveryRequest): Promise<DeliveryResponse> {
    console.log(`🚀 DeliveryService: Creating shipment for order #${request.orderId}`);
    console.log(`📦 DeliveryService: Partner: ${this.partner}, Service: ${this.config.serviceName}`);
    
    try {
      // Check if API key is available
      if (!this.config.apiKey) {
        console.warn(`⚠️ DeliveryService: ${this.config.serviceName} API key is not configured`);
        return {
          success: false,
          message: `${this.config.serviceName} API key is not configured`
        };
      }

      if (this.partner === 'delhivery') {
        console.log(`📮 DeliveryService: Using Delhivery API for order #${request.orderId}`);
        return await this.createDelhiveryShipment(request);
      }
      
      // For other partners, use mock data for now
      console.log(`🔧 DeliveryService: Using mock shipment for ${this.config.serviceName}, order #${request.orderId}`);
      
      const trackingId = `${this.partner.toUpperCase()}-${Date.now()}-${request.orderId}`;
      const trackingUrl = this.config.trackingUrlTemplate.replace('{trackingId}', trackingId);
      
      console.log(`✅ DeliveryService: Mock shipment created - Tracking ID: ${trackingId}`);
      
      return {
        success: true,
        trackingId,
        trackingUrl,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        message: 'Shipment created successfully'
      };
    } catch (error) {
      console.error(`❌ DeliveryService: Error creating shipment with ${this.config.serviceName}:`, error);
      return {
        success: false,
        message: `Failed to create shipment with ${this.config.serviceName}`,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Sanitize text for Delhivery API (remove special characters)
   */
  private sanitizeForDelhivery(text: string): string {
    // Delhivery doesn't accept special characters: &, #, %, ;, \
    // Replace them with spaces or remove them
    return text
      .replace(/[&#%;\\]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Create shipment with Delhivery API
   */
  private async createDelhiveryShipment(request: DeliveryRequest): Promise<DeliveryResponse> {
    console.log('\n📮 ========== DELHIVERY SHIPMENT CREATION ==========');
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log(`📦 Creating shipment for order #${request.orderId}`);
    
    try {
      // Get Delhivery configuration from environment
      const clientName = process.env.DELHIVERY_CLIENT_NAME || 'Blinkeach';
      const pickupLocation = process.env.DELHIVERY_PICKUP_LOCATION || 'Blinkeach Warehouse';
      const sellerAddress = process.env.COMPANY_ADDRESS || process.env.DELHIVERY_PICKUP_LOCATION || 'Blinkeach Warehouse';
      
      // Generate invoice number if not provided
      const invoiceNumber = `INV-${request.orderId}-${Date.now()}`;
      
      // const shipmentData = {
      //   shipments: [{
      //     name: request.recipientName,
      //     address: request.deliveryAddress,
      //     pin: request.pincode,
      //     city: request.city,
      //     state: request.state,
      //     country: 'India',
      //     phone: request.recipientPhone,
      //     order: request.orderId.toString(),
      //     payment_mode: request.isCod ? 'COD' : 'Prepaid',
      //     products_desc: request.items.map(item => `${item.name} x ${item.quantity}`).join(', '),
      //     cod_amount: request.isCod ? (request.orderValue / 100).toString() : '0',
      //     order_date: new Date().toISOString().split('T')[0],
      //     total_amount: (request.orderValue / 100).toString(),
      //     seller_address: pickupLocation,
      //     seller_name: clientName,
      //     seller_inv: invoiceNumber,
      //     quantity: request.items.reduce((total, item) => total + item.quantity, 0).toString(),
      //     waybill: '',
      //     shipment_width: (request.dimensions?.width || 10).toString(),
      //     shipment_height: (request.dimensions?.height || 10).toString(),
      //     weight: request.weight.toString(),
      //     seller_gst_tin: '',
      //     shipping_mode: 'Surface',
      //     address_type: 'home',
      //     client: clientName,
      //     pickup_location: pickupLocation
      //   }]
      // };
const shipmentData = {
  pickup_location: {
    name: pickupLocation
  },
  shipments: [{
    name: this.sanitizeForDelhivery(request.recipientName),
    add: this.sanitizeForDelhivery(request.deliveryAddress),
    pin: request.pincode,
    city: this.sanitizeForDelhivery(request.city),
    state: this.sanitizeForDelhivery(request.state),
    country: 'India',
    phone: request.recipientPhone,
    order: request.orderId.toString(),
    products_desc: this.sanitizeForDelhivery(request.items.map(item => `${item.name} x ${item.quantity}`).join(', ')),
    payment_mode: request.isCod ? 'COD' : 'Prepaid',
    cod_amount: request.isCod ? (request.orderValue / 100).toFixed(2) : '0',
    order_date: new Date().toISOString().split('T')[0],
    total_amount: (request.orderValue / 100).toFixed(2),
    seller_add: this.sanitizeForDelhivery(sellerAddress),
    seller_name: this.sanitizeForDelhivery(clientName),
    seller_inv: invoiceNumber,
    quantity: request.items.reduce((total, item) => total + item.quantity, 0).toString(),
    waybill: '',
    shipment_width: (request.dimensions?.width || 10).toString(),
    shipment_height: (request.dimensions?.height || 10).toString(),
    shipment_length: (request.dimensions?.length || 10).toString(),
    weight: request.weight.toString(),
    seller_gst_tin: '',
    shipping_mode: 'Surface',
    address_type: 'home'
  }]
};


      console.log('📋 Delhivery Shipment Details:');
      console.log('   - Recipient:', request.recipientName);
      console.log('   - Phone:', request.recipientPhone);
      console.log('   - Address:', request.deliveryAddress);
      console.log('   - City:', request.city);
      console.log('   - State:', request.state);
      console.log('   - Pincode:', request.pincode);
      console.log('   - Order Value: ₹' + (request.orderValue / 100).toFixed(2));
      console.log('   - Payment Mode:', request.isCod ? 'COD' : 'Prepaid');
      console.log('   - Weight:', request.weight + ' kg');
      console.log('   - Items:', request.items.length);
      console.log('   - Invoice Number:', invoiceNumber);
      console.log('   - Client:', clientName);
      console.log('   - Pickup Location:', pickupLocation);
      console.log('   - Seller Address:', sellerAddress);
      console.log('\n📦 Full Shipment Data:', JSON.stringify(shipmentData, null, 2));

      console.log(`\n🌐 Sending request to Delhivery API...`);
      console.log(`   - URL: ${this.config.baseUrl}/cmu/create.json`);
      console.log(`   - API Key: ***${this.config.apiKey.substring(this.config.apiKey.length - 8)}`);
      
      // Delhivery requires the data to be sent as form-urlencoded with 'format' and 'data' parameters
      const formData = new URLSearchParams();
      formData.append('format', 'json');
      formData.append('data', JSON.stringify(shipmentData));
      
      console.log('\n📤 Request Body (form-urlencoded):');
      console.log('   - format: json');
      console.log('   - data:', JSON.stringify(shipmentData));
      
      const response = await fetch(`${this.config.baseUrl}/cmu/create.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Token ${this.config.apiKey}`,
          'Accept': 'application/json'
        },
        body: formData.toString()
      });

      console.log(`\n📡 Delhivery API Response:`);
      console.log(`   - Status Code: ${response.status}`);
      console.log(`   - Status Text: ${response.statusText}`);
      
      const responseData = await response.json();
      console.log('📦 Response Data:', JSON.stringify(responseData, null, 2));

      if (response.ok && responseData.success) {
        const waybill = responseData.packages?.[0]?.waybill || responseData.waybill;
        const trackingUrl = this.config.trackingUrlTemplate.replace('{trackingId}', waybill);
        
        console.log(`\n✅ ========== SHIPMENT CREATED SUCCESSFULLY ==========`);
        console.log(`   - Waybill/Tracking ID: ${waybill}`);
        console.log(`   - Tracking URL: ${trackingUrl}`);
        console.log(`   - Estimated Delivery: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
        console.log(`📮 ====================================================\n`);
        
        return {
          success: true,
          trackingId: waybill,
          trackingUrl,
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          message: 'Delhivery shipment created successfully'
        };
      } else {
        console.error(`\n❌ ========== SHIPMENT CREATION FAILED ==========`);
        console.error(`   - HTTP Status: ${response.status}`);
        console.error(`   - Success Flag: ${responseData.success}`);
        console.error(`   - Message: ${responseData.message || responseData.rmk || 'Unknown error'}`);
        console.error(`   - Errors:`, responseData.errors || ['Unknown error from Delhivery API']);
        console.error(`   - Full Response:`, JSON.stringify(responseData, null, 2));
        
        // Check for common issues
        if (responseData.rmk && responseData.rmk.includes('no data')) {
          console.error(`\n⚠️ POSSIBLE CAUSES:`);
          console.error(`   1. Pickup location "${pickupLocation}" may not be registered with Delhivery`);
          console.error(`   2. Client name "${clientName}" may not match the registered name`);
          console.error(`   3. Required fields may be missing or in wrong format`);
          console.error(`   4. API key may not have permission to create shipments`);
          console.error(`\n💡 SOLUTIONS:`);
          console.error(`   - Verify pickup location name matches exactly (case-sensitive)`);
          console.error(`   - Check if warehouse is registered in Delhivery dashboard`);
          console.error(`   - Ensure all required fields are present and valid`);
        }
        
        console.error(`📮 ================================================\n`);
        return {
          success: false,
          message: responseData.message || responseData.rmk || 'Failed to create Delhivery shipment',
          errors: responseData.errors || [responseData.rmk || 'Unknown error from Delhivery API']
        };
      }
    } catch (error) {
      console.error('\n❌ ========== SHIPMENT CREATION ERROR ==========');
      console.error('Error details:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('📮 ================================================\n');
      return {
        success: false,
        message: 'Failed to create Delhivery shipment',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
  
  /**
   * Get tracking information for a shipment
   */
  async getTrackingInfo(trackingId: string): Promise<any> {
    console.log(`🔍 DeliveryService: Getting tracking info for ID: ${trackingId}`);
    console.log(`📦 DeliveryService: Partner: ${this.partner}, Service: ${this.config.serviceName}`);
    
    try {
      // Check if API key is available
      if (!this.config.apiKey) {
        console.warn(`⚠️ DeliveryService: ${this.config.serviceName} API key is not configured`);
        return {
          success: false,
          message: `${this.config.serviceName} API key is not configured`
        };
      }

      if (this.partner === 'delhivery') {
        console.log(`📮 DeliveryService: Fetching tracking from Delhivery API for ID: ${trackingId}`);
        return await this.getDelhiveryTrackingInfo(trackingId);
      }
      
      // For other partners, use mock data for now
      console.log(`🔧 DeliveryService: Using mock tracking data for ${this.config.serviceName}, ID: ${trackingId}`);
      
      const mockData = {
        success: true,
        trackingId,
        status: 'in_transit',
        currentLocation: 'Mumbai Sorting Center',
        updates: [
          {
            timestamp: new Date(),
            status: 'in_transit',
            location: 'Mumbai Sorting Center',
            description: 'Shipment has been processed at sorting center'
          },
          {
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
            status: 'picked_up',
            location: 'Seller Warehouse',
            description: 'Shipment has been picked up from seller'
          }
        ],
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      };
      
      console.log(`✅ DeliveryService: Mock tracking data returned for ID: ${trackingId}`);
      return mockData;
    } catch (error) {
      console.error(`❌ DeliveryService: Error getting tracking info from ${this.config.serviceName}:`, error);
      return {
        success: false,
        message: `Failed to get tracking info from ${this.config.serviceName}`,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Get tracking information from Delhivery API
   */
  private async getDelhiveryTrackingInfo(waybill: string): Promise<any> {
    console.log('\n🔍 ========== DELHIVERY TRACKING INFO ==========');
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log(`📮 Getting tracking info for waybill: ${waybill}`);
    
    try {
      const trackingUrl = `${this.config.baseUrl}/v1/packages/json/?waybill=${waybill}`;
      console.log(`\n🌐 Sending request to Delhivery API...`);
      console.log(`   - URL: ${trackingUrl}`);
      console.log(`   - API Key: ***${this.config.apiKey.substring(this.config.apiKey.length - 8)}`);
      
      const response = await fetch(trackingUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.config.apiKey}`,
          'Accept': 'application/json'
        }
      });

      console.log(`\n📡 Delhivery API Response:`);
      console.log(`   - Status Code: ${response.status}`);
      console.log(`   - Status Text: ${response.statusText}`);
      
      const responseData = await response.json();
      console.log('📦 Tracking Response Data:', JSON.stringify(responseData, null, 2));

      if (response.ok && responseData.ShipmentData?.length > 0) {
        const shipment = responseData.ShipmentData[0].Shipment;
        const scans = shipment.Scans || [];
        
        // Map Delhivery status to our status
        const statusMap: { [key: string]: string } = {
          'PickedUp': 'picked_up',
          'InTransit': 'in_transit',
          'OutForDelivery': 'out_for_delivery',
          'Delivered': 'delivered',
          'RTO': 'returned',
          'Cancelled': 'cancelled'
        };

        const currentStatus = shipment.Status?.Status || 'unknown';
        const mappedStatus = statusMap[currentStatus] || 'in_transit';

        const updates = scans.map((scan: any) => ({
          timestamp: new Date(scan.ScanDateTime),
          status: statusMap[scan.Scan] || scan.Scan,
          location: scan.ScannedLocation,
          description: scan.Instructions || `Package ${scan.Scan}`
        }));

        const trackingResult = {
          success: true,
          trackingId: waybill,
          status: mappedStatus,
          currentLocation: shipment.Origin || 'Unknown',
          updates: updates.reverse(), // Show latest first
          estimatedDelivery: shipment.ExpectedDeliveryDate ? new Date(shipment.ExpectedDeliveryDate) : null
        };
        
        console.log(`\n✅ ========== TRACKING INFO RETRIEVED ==========`);
        console.log(`   - Waybill: ${waybill}`);
        console.log(`   - Status: ${mappedStatus}`);
        console.log(`   - Current Location: ${trackingResult.currentLocation}`);
        console.log(`   - Updates Count: ${updates.length}`);
        console.log(`   - Estimated Delivery: ${trackingResult.estimatedDelivery?.toLocaleDateString() || 'N/A'}`);
        console.log(`🔍 ================================================\n`);
        
        return trackingResult;
      } else {
        console.warn(`\n⚠️ ========== NO TRACKING DATA FOUND ==========`);
        console.warn(`   - Waybill: ${waybill}`);
        console.warn(`   - Reason: Invalid waybill or shipment not found`);
        console.warn(`🔍 ================================================\n`);
        return {
          success: false,
          message: 'Tracking information not found',
          errors: ['Invalid waybill or shipment not found']
        };
      }
    } catch (error) {
      console.error('\n❌ ========== TRACKING INFO ERROR ==========');
      console.error('Error details:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('🔍 ================================================\n');
      return {
        success: false,
        message: 'Failed to get tracking information from Delhivery',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
  
  /**
   * Cancel a shipment
   */
  async cancelShipment(trackingId: string): Promise<any> {
    // In a real implementation, this would make an API call to the delivery partner
    try {
      // Check if API key is available
      if (!this.config.apiKey) {
        return {
          success: false,
          message: `${this.config.serviceName} API key is not configured`
        };
      }
      
      // Mock the API call for now
      console.log(`Cancelling shipment with ${this.config.serviceName} for tracking ID ${trackingId}`);
      
      // Mock a successful response
      return {
        success: true,
        trackingId,
        status: 'cancelled',
        message: 'Shipment has been cancelled successfully'
      };
    } catch (error) {
      console.error(`Error cancelling shipment with ${this.config.serviceName}:`, error);
      return {
        success: false,
        message: `Failed to cancel shipment with ${this.config.serviceName}`,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
  
  /**
   * Get tracking URL for a shipment
   */
  getTrackingUrl(trackingId: string): string {
    return this.config.trackingUrlTemplate.replace('{trackingId}', trackingId);
  }
  
  /**
   * Convert order to delivery request
   */
  static orderToDeliveryRequest(order: Order, user: any, items: any[]): DeliveryRequest {
    // Parse shipping address
    // Expected formats: 
    // 1. "Street, City, State - Pincode"
    // 2. "Street City, State - Pincode"
    // 3. "Street, State - Pincode"
    const addressParts = order.shippingAddress.split(', ');
    
    console.log('📍 Parsing shipping address:', order.shippingAddress);
    console.log('📍 Address parts:', addressParts);
    
    // Extract pincode, state, and city with better parsing
    let pincode = '400001'; // Default
    let state = 'Maharashtra'; // Default
    let city = 'Mumbai'; // Default
    let streetAddress = order.shippingAddress;
    
    // Handle format: "Street City, State - Pincode" (2 parts)
    if (addressParts.length === 2) {
      const lastPart = addressParts[1]; // "State - Pincode"
      
      if (lastPart.includes(' - ')) {
        const [statePart, pincodePart] = lastPart.split(' - ');
        state = statePart.trim();
        pincode = pincodePart.trim();
        
        // First part contains "Street City" - extract city as last word
        const firstPart = addressParts[0].trim();
        const firstPartWords = firstPart.split(' ');
        
        if (firstPartWords.length >= 2) {
          // Last word is likely the city
          city = firstPartWords[firstPartWords.length - 1];
          // Everything else is the street address
          streetAddress = firstPartWords.slice(0, -1).join(' ');
        } else {
          // If only one word, use it as both street and city
          city = firstPart;
          streetAddress = firstPart;
        }
        
        console.log('📍 Parsed format: "Street City, State - Pincode"');
      }
    }
    // Handle format: "Street, City, State - Pincode" (3+ parts)
    else if (addressParts.length >= 3) {
      // Last part usually contains "State - Pincode"
      const lastPart = addressParts[addressParts.length - 1];
      
      // Extract pincode and state from "State - Pincode" format
      if (lastPart.includes(' - ')) {
        const [statePart, pincodePart] = lastPart.split(' - ');
        state = statePart.trim();
        pincode = pincodePart.trim();
        
        // City is the second-to-last part (before "State - Pincode")
        // But it might contain multiple parts like "Sunny Residency,begumpet Hyderabaad"
        const cityPart = addressParts[addressParts.length - 2]?.trim() || city;
        
        // Extract city name from complex strings
        // Look for patterns like "something,cityname" or "something cityname"
        let streetParts: string[] = [];
        
        if (cityPart.includes(',')) {
          // Split by comma and take the last part as city
          const citySubParts = cityPart.split(',');
          const lastSubPart = citySubParts[citySubParts.length - 1].trim();
          
          // Extract city name from "begumpet Hyderabaad" -> "Hyderabaad"
          const cityWords = lastSubPart.split(' ');
          if (cityWords.length >= 2) {
            city = cityWords[cityWords.length - 1]; // Last word is the city
            // Add the area/locality to street address
            const locality = cityWords.slice(0, -1).join(' ');
            if (locality) {
              streetParts.push(locality);
            }
          } else {
            city = lastSubPart;
          }
          
          // Add the parts before the city to street address
          const beforeCity = citySubParts.slice(0, -1).join(',');
          if (beforeCity) {
            streetParts.unshift(beforeCity);
          }
        } else {
          // No comma, try to extract city from space-separated words
          const cityWords = cityPart.split(' ');
          if (cityWords.length >= 2) {
            city = cityWords[cityWords.length - 1]; // Last word is the city
            // Add the area/locality to street address
            const locality = cityWords.slice(0, -1).join(' ');
            if (locality) {
              streetParts.push(locality);
            }
          } else {
            city = cityPart;
          }
        }
        
        // Street address is everything before the last 2 parts + extracted locality
        const baseStreet = addressParts.slice(0, addressParts.length - 2).join(', ').trim();
        if (baseStreet) {
          streetParts.unshift(baseStreet);
        }
        streetAddress = streetParts.join(', ') || order.shippingAddress;
      } else if (/^\d{6}$/.test(lastPart.trim())) {
        // If last part is just 6 digits, it's the pincode
        pincode = lastPart.trim();
        state = addressParts[addressParts.length - 2]?.trim() || state;
        city = addressParts[addressParts.length - 3]?.trim() || city;
        
        // Street address is everything before the last 3 parts
        streetAddress = addressParts.slice(0, addressParts.length - 3).join(', ').trim() || order.shippingAddress;
      } else {
        // Fallback: try to extract pincode from last part
        pincode = lastPart.trim();
        city = addressParts[addressParts.length - 2]?.trim() || city;
        
        // Street address is everything before the last 2 parts
        streetAddress = addressParts.slice(0, addressParts.length - 2).join(', ').trim() || order.shippingAddress;
      }
    }
    
    // Ensure pincode is only digits (remove any non-numeric characters)
    pincode = pincode.replace(/\D/g, '');
    
    // If pincode is not 6 digits, use default
    if (!/^\d{6}$/.test(pincode)) {
      console.warn(`⚠️ Invalid pincode extracted: "${pincode}", using default`);
      pincode = '400001';
    }
    
    // Validate and correct state names (handle common typos)
    const stateCorrections: { [key: string]: string } = {
      'telanganna': 'Telangana',
      'telangana': 'Telangana',
      'andhra pradesh': 'Andhra Pradesh',
      'karnataka': 'Karnataka',
      'tamil nadu': 'Tamil Nadu',
      'maharashtra': 'Maharashtra',
      'kerala': 'Kerala',
      'gujarat': 'Gujarat',
      'rajasthan': 'Rajasthan',
      'west bengal': 'West Bengal',
      'madhya pradesh': 'Madhya Pradesh',
      'uttar pradesh': 'Uttar Pradesh',
      'bihar': 'Bihar',
      'odisha': 'Odisha',
      'punjab': 'Punjab',
      'haryana': 'Haryana',
      'jharkhand': 'Jharkhand',
      'chhattisgarh': 'Chhattisgarh',
      'assam': 'Assam',
      'uttarakhand': 'Uttarakhand',
      'himachal pradesh': 'Himachal Pradesh',
      'goa': 'Goa',
      'delhi': 'Delhi',
      'new delhi': 'Delhi'
    };
    
    const stateLower = state.toLowerCase();
    if (stateCorrections[stateLower]) {
      const originalState = state;
      state = stateCorrections[stateLower];
      if (originalState !== state) {
        console.log(`📍 Corrected state: "${originalState}" → "${state}"`);
      }
    } else {
      console.warn(`⚠️ Unknown state: "${state}" - Delhivery may reject this`);
    }
    
    // Validate and correct city names (handle common typos)
    const cityCorrections: { [key: string]: string } = {
      'hyderabaad': 'Hyderabad',
      'hyderabad': 'Hyderabad',
      'bengaluru': 'Bangalore',
      'bangalore': 'Bangalore',
      'mumbai': 'Mumbai',
      'delhi': 'Delhi',
      'chennai': 'Chennai',
      'kolkata': 'Kolkata',
      'pune': 'Pune',
      'ahmedabad': 'Ahmedabad',
      'jaipur': 'Jaipur',
      'lucknow': 'Lucknow',
      'kanpur': 'Kanpur',
      'nagpur': 'Nagpur',
      'indore': 'Indore',
      'thane': 'Thane',
      'bhopal': 'Bhopal',
      'visakhapatnam': 'Visakhapatnam',
      'pimpri-chinchwad': 'Pimpri-Chinchwad',
      'patna': 'Patna',
      'vadodara': 'Vadodara',
      'ghaziabad': 'Ghaziabad',
      'ludhiana': 'Ludhiana',
      'agra': 'Agra',
      'nashik': 'Nashik',
      'faridabad': 'Faridabad',
      'meerut': 'Meerut',
      'rajkot': 'Rajkot',
      'kalyan-dombivali': 'Kalyan-Dombivali',
      'vasai-virar': 'Vasai-Virar',
      'varanasi': 'Varanasi',
      'srinagar': 'Srinagar',
      'aurangabad': 'Aurangabad',
      'dhanbad': 'Dhanbad',
      'amritsar': 'Amritsar',
      'navi mumbai': 'Navi Mumbai',
      'allahabad': 'Allahabad',
      'ranchi': 'Ranchi',
      'howrah': 'Howrah',
      'coimbatore': 'Coimbatore',
      'jabalpur': 'Jabalpur',
      'gwalior': 'Gwalior',
      'vijayawada': 'Vijayawada',
      'jodhpur': 'Jodhpur',
      'madurai': 'Madurai',
      'raipur': 'Raipur',
      'kota': 'Kota',
      'guwahati': 'Guwahati',
      'chandigarh': 'Chandigarh',
      'solapur': 'Solapur',
      'hubli-dharwad': 'Hubli-Dharwad',
      'bareilly': 'Bareilly',
      'moradabad': 'Moradabad',
      'mysore': 'Mysore',
      'gurgaon': 'Gurgaon',
      'aligarh': 'Aligarh',
      'jalandhar': 'Jalandhar',
      'tiruchirappalli': 'Tiruchirappalli',
      'bhubaneswar': 'Bhubaneswar',
      'salem': 'Salem',
      'warangal': 'Warangal',
      'mira-bhayandar': 'Mira-Bhayandar',
      'thiruvananthapuram': 'Thiruvananthapuram',
      'bhiwandi': 'Bhiwandi',
      'saharanpur': 'Saharanpur',
      'guntur': 'Guntur',
      'amravati': 'Amravati',
      'bikaner': 'Bikaner',
      'noida': 'Noida',
      'jamshedpur': 'Jamshedpur',
      'bhilai nagar': 'Bhilai Nagar',
      'cuttack': 'Cuttack',
      'firozabad': 'Firozabad',
      'kochi': 'Kochi',
      'bhavnagar': 'Bhavnagar',
      'dehradun': 'Dehradun',
      'durgapur': 'Durgapur',
      'asansol': 'Asansol',
      'nanded-waghala': 'Nanded-Waghala',
      'kolapur': 'Kolapur',
      'ajmer': 'Ajmer',
      'gulbarga': 'Gulbarga',
      'jamnagar': 'Jamnagar',
      'ujjain': 'Ujjain',
      'loni': 'Loni',
      'siliguri': 'Siliguri',
      'jhansi': 'Jhansi',
      'ulhasnagar': 'Ulhasnagar',
      'nellore': 'Nellore',
      'jammu': 'Jammu',
      'sangli-miraj & kupwad': 'Sangli-Miraj & Kupwad',
      'mangalore': 'Mangalore',
      'erode': 'Erode',
      'belgaum': 'Belgaum',
      'ambattur': 'Ambattur',
      'tirunelveli': 'Tirunelveli',
      'malegaon': 'Malegaon',
      'gaya': 'Gaya',
      'jalgaon': 'Jalgaon',
      'udaipur': 'Udaipur',
      'maheshtala': 'Maheshtala'
    };
    
    const cityLower = city.toLowerCase();
    if (cityCorrections[cityLower]) {
      const originalCity = city;
      city = cityCorrections[cityLower];
      if (originalCity !== city) {
        console.log(`📍 Corrected city: "${originalCity}" → "${city}"`);
      }
    }
    
    console.log('📍 Parsed address:');
    console.log('   - Street:', streetAddress);
    console.log('   - City:', city);
    console.log('   - State:', state);
    console.log('   - Pincode:', pincode);
    
    // Calculate total weight (mocked for now)
    const weight = items.reduce((total, item) => total + (item.quantity * 0.5), 0.5);
    
    return {
      orderId: order.id,
      recipientName: user.fullName,
      recipientPhone: user.phone,
      recipientEmail: user.email,
      deliveryAddress: streetAddress,
      city,
      state,
      pincode,
      weight,
      orderValue: order.totalAmount,
      isCod: order.paymentMethod === 'cod',
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };
  }

  /**
   * Register a warehouse/pickup location with Delhivery
   * This is required before creating shipments
   */
  async registerWarehouse(warehouseData: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    contactPerson: string;
    contactPhone: string;
    contactEmail: string;
  }): Promise<DeliveryResponse> {
    console.log('\n🏭 ========== DELHIVERY WAREHOUSE REGISTRATION ==========');
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('📦 Registering warehouse with Delhivery');
    console.log('📋 Warehouse Details:');
    console.log('   - Name:', warehouseData.name);
    console.log('   - Address:', warehouseData.address);
    console.log('   - City:', warehouseData.city);
    console.log('   - State:', warehouseData.state);
    console.log('   - Pincode:', warehouseData.pincode);
    console.log('   - Contact:', warehouseData.contactPerson);
    console.log('   - Phone:', warehouseData.contactPhone);
    console.log('   - Email:', warehouseData.contactEmail);

    try {
      // Check if API key is available
      if (!this.config.apiKey) {
        console.error('❌ Delhivery API key is not configured');
        return {
          success: false,
          message: 'Delhivery API key is not configured',
          errors: ['API key missing']
        };
      }

      // Prepare warehouse registration data
      const registrationData = {
        name: warehouseData.name,
        address: warehouseData.address,
        city: warehouseData.city,
        state: warehouseData.state,
        pin: warehouseData.pincode,
        country: 'India',
        phone: warehouseData.contactPhone,
        email: warehouseData.contactEmail,
        registered_name: warehouseData.contactPerson,
        return_address: warehouseData.address,
        return_city: warehouseData.city,
        return_state: warehouseData.state,
        return_pin: warehouseData.pincode,
        return_country: 'India'
      };

      console.log('\n📦 Warehouse Registration Data:', JSON.stringify(registrationData, null, 2));

      // Delhivery warehouse creation API endpoint
      const warehouseUrl = `${this.config.baseUrl}/backend/clientwarehouse/create/`;
      
      console.log('\n🌐 Sending request to Delhivery Warehouse API...');
      console.log('   - URL:', warehouseUrl);
      console.log('   - API Key: ***' + this.config.apiKey.substring(this.config.apiKey.length - 8));

      const response = await fetch(warehouseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.config.apiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });

      console.log('\n📡 Delhivery API Response:');
      console.log('   - Status Code:', response.status);
      console.log('   - Status Text:', response.statusText);

      const responseData = await response.json();
      console.log('📦 Response Data:', JSON.stringify(responseData, null, 2));

      if (response.ok && responseData.success !== false) {
        console.log('\n✅ ========== WAREHOUSE REGISTERED SUCCESSFULLY ==========');
        console.log('   - Warehouse Name:', warehouseData.name);
        console.log('   - Status: Pending Verification');
        console.log('   - Note: Delhivery will verify this warehouse within 24-48 hours');
        console.log('🏭 =========================================================\n');

        return {
          success: true,
          message: 'Warehouse registered successfully. Awaiting Delhivery verification (24-48 hours).',
          trackingId: warehouseData.name
        };
      } else {
        console.error('\n❌ ========== WAREHOUSE REGISTRATION FAILED ==========');
        console.error('   - Message:', responseData.message || 'Unknown error');
        console.error('   - Errors:', responseData.errors || ['Unknown error from Delhivery API']);
        console.error('🏭 ======================================================\n');

        return {
          success: false,
          message: responseData.message || 'Failed to register warehouse',
          errors: responseData.errors || ['Unknown error from Delhivery API']
        };
      }
    } catch (error) {
      console.error('\n❌ ========== WAREHOUSE REGISTRATION ERROR ==========');
      console.error('Error details:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('🏭 =====================================================\n');

      return {
        success: false,
        message: 'Failed to register warehouse with Delhivery',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
}

// Export delivery service
export const deliveryService = new DeliveryService(
  (process.env.DELIVERY_PARTNER as DeliveryPartner) || 'delhivery'
);

// Export a utility function to more easily access the static method
export const orderToDeliveryRequest = DeliveryService.orderToDeliveryRequest;

export default deliveryService;