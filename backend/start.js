#!/usr/bin/env node

/**
 * CollegeConnect Backend Startup Script
 * This script helps you get started with the backend server
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 CollegeConnect Backend Setup');
console.log('================================\n');

// Check if config.env exists
const configPath = path.join(__dirname, 'config.env');
if (!fs.existsSync(configPath)) {
  console.log('❌ config.env file not found!');
  console.log('📝 Please create config.env file with the following content:\n');
  
  const sampleConfig = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/collegeconnect
# Alternative: MongoDB Atlas connection string
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collegeconnect

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads`;
  
  console.log(sampleConfig);
  console.log('\n📖 For detailed setup instructions, see MONGODB_SETUP.md');
  process.exit(1);
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully!\n');
  } catch (error) {
    console.log('❌ Failed to install dependencies');
    console.log('Please run: npm install');
    process.exit(1);
  }
}

// Check MongoDB connection
console.log('🔍 Checking MongoDB connection...');
try {
  const mongoose = require('mongoose');
  require('dotenv').config({ path: './config.env' });
  
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('🌐 Starting server...\n');
    
    // Start the server
    require('./server.js');
  }).catch((error) => {
    console.log('❌ MongoDB connection failed!');
    console.log('Error:', error.message);
    console.log('\n📖 Please check your MongoDB setup:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check your MONGODB_URI in config.env');
    console.log('3. See MONGODB_SETUP.md for detailed instructions');
    process.exit(1);
  });
} catch (error) {
  console.log('❌ Error loading dependencies');
  console.log('Please make sure all packages are installed');
  process.exit(1);
}
