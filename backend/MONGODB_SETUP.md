# MongoDB Setup Guide for CollegeConnect

## 🗄️ MongoDB Installation & Configuration

### Option 1: Local MongoDB Installation

#### **Windows:**
1. **Download MongoDB Community Server:**
   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select Windows and download the MSI installer

2. **Install MongoDB:**
   - Run the MSI installer
   - Choose "Complete" installation
   - Install MongoDB as a Windows Service
   - Install MongoDB Compass (GUI tool)

3. **Start MongoDB Service:**
   ```bash
   # MongoDB should start automatically as a Windows service
   # You can also start it manually:
   net start MongoDB
   ```

4. **Verify Installation:**
   ```bash
   # Open Command Prompt and run:
   mongod --version
   mongo --version
   ```

#### **macOS:**
```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

#### **Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster:**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a cloud provider and region
   - Name your cluster (e.g., "collegeconnect")

3. **Set up Database Access:**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password
   - Set privileges to "Read and write to any database"

4. **Set up Network Access:**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0) for development
   - For production, add your specific IP addresses

5. **Get Connection String:**
   - Go to "Clusters" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

## 🔧 Configuration

### Update Environment Variables

1. **For Local MongoDB:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/collegeconnect
   ```

2. **For MongoDB Atlas:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collegeconnect?retryWrites=true&w=majority
   ```

### Update config.env File

Replace the placeholder values in `backend/config.env`:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/collegeconnect
# OR for Atlas:
# MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/collegeconnect?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## 🚀 Testing the Connection

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
npm run dev
```

### 3. Test the API
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
{
  "success": true,
  "message": "CollegeConnect API is running!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

### 4. Test Database Connection
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "college": "Test College"
  }'
```

## 🛠️ MongoDB Compass (GUI Tool)

### Installation:
1. Download from [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Install and open the application

### Connection:
1. **For Local MongoDB:**
   - Connection String: `mongodb://localhost:27017`

2. **For MongoDB Atlas:**
   - Use the connection string from Atlas dashboard

### Usage:
- Browse your databases and collections
- View and edit documents
- Run queries
- Monitor performance

## 📊 Database Structure

Once connected, you'll see these collections:

```
collegeconnect/
├── users/           # User profiles and authentication
├── posts/           # Forum posts
├── comments/        # Post comments
├── events/          # College events
├── projects/        # Project collaborations
├── teams/           # Hackathon teams
└── notifications/   # User notifications
```

## 🔍 Common Issues & Solutions

### Issue 1: Connection Refused
```bash
# Error: connect ECONNREFUSED 127.0.0.1:27017
# Solution: Make sure MongoDB is running
```

**Windows:**
```bash
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb/brew/mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Issue 2: Authentication Failed
```bash
# Error: Authentication failed
# Solution: Check username/password in connection string
```

### Issue 3: Network Access Denied (Atlas)
```bash
# Error: IP not in whitelist
# Solution: Add your IP to Atlas Network Access
```

### Issue 4: Database Not Found
```bash
# Error: Database not found
# Solution: Database will be created automatically on first use
```

## 🧪 Testing with Sample Data

### Create Sample User:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "college": "MIT",
    "course": "Computer Science",
    "year": "3rd Year",
    "skills": ["JavaScript", "React", "Node.js"]
  }'
```

### Create Sample Post:
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Looking for React Developer",
    "content": "We need a React developer for our hackathon project. Must have experience with hooks and state management.",
    "category": "tech",
    "tags": ["react", "javascript", "hackathon"]
  }'
```

## 📈 Monitoring & Maintenance

### Check Database Status:
```bash
# Connect to MongoDB shell
mongo

# Show databases
show dbs

# Use collegeconnect database
use collegeconnect

# Show collections
show collections

# Count documents in users collection
db.users.countDocuments()
```

### Backup Database:
```bash
# Create backup
mongodump --db collegeconnect --out ./backup

# Restore backup
mongorestore --db collegeconnect ./backup/collegeconnect
```

## 🔒 Security Best Practices

1. **Use Strong Passwords** for database users
2. **Enable Authentication** in production
3. **Use SSL/TLS** connections
4. **Regular Backups** of your data
5. **Monitor Access Logs** for suspicious activity
6. **Keep MongoDB Updated** to latest version

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)

---

**Need Help?** Check the console logs for detailed error messages and ensure all environment variables are set correctly.
