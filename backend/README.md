# CollegeConnect Backend API

This is the backend API for the CollegeConnect platform, built with Node.js, Express, and MongoDB.

## 🗄️ Database Models

### 1. **User Model**
- **Purpose**: Store user information, authentication, and profiles
- **Key Fields**: name, email, password, role, college, skills, social links
- **Roles**: student, faculty, admin
- **Features**: JWT authentication, password hashing, profile management

### 2. **Post Model**
- **Purpose**: Forum posts and discussions
- **Key Fields**: title, content, author, category, tags, upvotes/downvotes
- **Categories**: tech, design, business, placement-prep, hackathons, etc.
- **Features**: Text search, voting system, comment system

### 3. **Comment Model**
- **Purpose**: Comments on forum posts
- **Key Fields**: content, author, post, parentComment, replies
- **Features**: Nested comments, voting, mentions, edit history

### 4. **Event Model**
- **Purpose**: College events, hackathons, workshops
- **Key Fields**: name, description, organizer, dates, location, participants
- **Types**: hackathon, conference, workshop, tech-talk, etc.
- **Features**: RSVP system, event management, location-based search

### 5. **Project Model**
- **Purpose**: Project collaboration board
- **Key Fields**: title, description, owner, required skills, members, join requests
- **Types**: web-development, mobile-app, ai-ml, data-science, etc.
- **Features**: Skill-based matching, team formation, project management

### 6. **Team Model**
- **Purpose**: Hackathon and event teams
- **Key Fields**: name, description, leader, event, members, required skills
- **Features**: Team formation, join requests, skill matching

### 7. **Notification Model**
- **Purpose**: User notifications and alerts
- **Key Fields**: recipient, sender, type, title, message, status
- **Types**: post_comment, project_join_request, event_reminder, etc.
- **Features**: Multi-channel delivery, priority levels, expiration

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `config.env` and update the values
   - Set your MongoDB connection string
   - Set your JWT secret key

3. **Start the server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/collegeconnect

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

## 📊 Database Schema Relationships

```
User (1) ──→ (N) Post
User (1) ──→ (N) Comment
User (1) ──→ (N) Event
User (1) ──→ (N) Project
User (1) ──→ (N) Team
User (1) ──→ (N) Notification

Post (1) ──→ (N) Comment
Event (1) ──→ (N) Team
Project (1) ──→ (N) Team
```

## 🔧 API Endpoints (Coming Soon)

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event by ID
- `POST /api/events/:id/rsvp` - RSVP to event

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects/:id/join` - Request to join project

## 🛡️ Security Features

- **Helmet**: Security headers
- **Rate Limiting**: Prevent abuse
- **CORS**: Cross-origin resource sharing
- **JWT**: Secure authentication
- **Password Hashing**: bcryptjs
- **Input Validation**: express-validator
- **MongoDB Injection Protection**: Mongoose

## 📈 Performance Features

- **Database Indexing**: Optimized queries
- **Text Search**: Full-text search capabilities
- **Pagination**: Efficient data loading
- **Caching**: Redis (coming soon)
- **Compression**: gzip compression

## 🧪 Testing

```bash
# Run tests (coming soon)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 API Documentation

API documentation will be available at `/api/docs` once implemented.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
