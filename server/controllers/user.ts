import { Request, Response } from "express";
import { storage } from "../storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

// In a real application, we would use proper authentication and session management
// This is a simplified version for demonstration purposes
const userController = {
  // Register a new user
  register: async (req: Request, res: Response) => {
    try {
      console.log('\n🔐 ═══════════════════════════════════════════════════════');
      console.log('📝 USER REGISTRATION ATTEMPT (Legacy Endpoint)');
      console.log('═══════════════════════════════════════════════════════');
      console.log('📧 Email:', req.body.email);
      console.log('👤 Username:', req.body.username);
      console.log('📛 Full Name:', req.body.fullName);
      console.log('🕐 Timestamp:', new Date().toLocaleString());
      console.log('═══════════════════════════════════════════════════════\n');
      
      // Validate user data
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        console.log('❌ REGISTRATION FAILED: Username already exists');
        console.log('👤 Duplicate Username:', userData.username);
        console.log('═══════════════════════════════════════════════════════\n');
        return res.status(400).json({ message: "Username already exists" });
      }
      
      if (userData.email) {
        const existingUserByEmail = await storage.getUserByEmail(userData.email);
        if (existingUserByEmail) {
          console.log('❌ REGISTRATION FAILED: Email already exists');
          console.log('📧 Duplicate Email:', userData.email);
          console.log('═══════════════════════════════════════════════════════\n');
          return res.status(400).json({ message: "Email already exists" });
        }
      }
      
      // In a real application, we would hash the password here
      // For demonstration, we're using plain text passwords
      
      const user = await storage.createUser(userData);
      
      console.log('✅ USER REGISTERED SUCCESSFULLY!');
      console.log('🆔 User ID:', user.id);
      console.log('👤 Username:', user.username);
      console.log('📧 Email:', user.email);
      console.log('📛 Full Name:', user.fullName);
      console.log('═══════════════════════════════════════════════════════\n');
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('❌ REGISTRATION VALIDATION ERROR');
        console.log('⚠️ Validation Errors:', error.errors);
        console.log('═══════════════════════════════════════════════════════\n');
        return res.status(400).json({ 
          message: "Invalid user data", 
          errors: error.errors 
        });
      }
      
      console.log('💥 REGISTRATION ERROR!');
      console.log('⚠️ Error:', error);
      console.log('═══════════════════════════════════════════════════════\n');
      res.status(500).json({ message: "Failed to register user" });
    }
  },
  
  // Login user
  login: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      console.log('\n🔐 ═══════════════════════════════════════════════════════');
      console.log('🔑 USER LOGIN ATTEMPT (Legacy Endpoint)');
      console.log('═══════════════════════════════════════════════════════');
      console.log('👤 Username:', username);
      console.log('🕐 Timestamp:', new Date().toLocaleString());
      console.log('═══════════════════════════════════════════════════════\n');
      
      if (!username || !password) {
        console.log('❌ LOGIN FAILED: Missing credentials');
        console.log('═══════════════════════════════════════════════════════\n');
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        console.log('❌ LOGIN FAILED: User not found');
        console.log('👤 Username:', username);
        console.log('═══════════════════════════════════════════════════════\n');
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real application, we would compare hashed passwords
      if (user.password !== password) {
        console.log('❌ LOGIN FAILED: Invalid password');
        console.log('👤 Username:', username);
        console.log('═══════════════════════════════════════════════════════\n');
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      console.log('✅ LOGIN SUCCESSFUL!');
      console.log('🆔 User ID:', user.id);
      console.log('👤 Username:', user.username);
      console.log('📧 Email:', user.email);
      console.log('📛 Full Name:', user.fullName);
      console.log('👑 Is Admin:', user.isAdmin ? 'Yes' : 'No');
      console.log('🔑 Mock Token Generated');
      console.log('═══════════════════════════════════════════════════════\n');
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        ...userWithoutPassword,
        token: `mock_token_${user.id}_${Date.now()}` // Mock token for demonstration
      });
    } catch (error) {
      console.log('💥 LOGIN ERROR!');
      console.log('⚠️ Error:', error);
      console.log('═══════════════════════════════════════════════════════\n');
      res.status(500).json({ message: "Failed to login" });
    }
  },
  
  // Get user profile
  getProfile: async (req: Request, res: Response) => {
    try {
      // In a real application, we would extract user ID from JWT token
      // For demonstration, we're expecting userId in the query params
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Valid user ID is required" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  },
  
  // Update user profile
  updateProfile: async (req: Request, res: Response) => {
    try {
      // In a real application, we would extract user ID from JWT token
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Valid user ID is required" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const userData = req.body;
      
      // Don't allow updating username or email to existing values
      if (userData.username && userData.username !== user.username) {
        const existingUser = await storage.getUserByUsername(userData.username);
        if (existingUser) {
          return res.status(400).json({ message: "Username already exists" });
        }
      }
      
      if (userData.email && userData.email !== user.email) {
        const existingUser = await storage.getUserByEmail(userData.email);
        if (existingUser) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }
      
      const updatedUser = await storage.updateUser(userId, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  }
};

export default userController;
