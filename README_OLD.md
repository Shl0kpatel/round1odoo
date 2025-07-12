# StackIt - Q&A Platform

A modern full-stack Q&A platform built with React, Node.js, Express, and MongoDB. StackIt provides a comprehensive solution for communities to ask questions, share knowledge, and collaborate.

## Features

### 🎯 Core Features
- **User Authentication**: JWT-based authentication with role-based access control
- **Question & Answer System**: Rich text editor for creating detailed questions and answers
- **Voting System**: Upvote/downvote questions and answers
- **Tagging System**: Organize questions with relevant tags
- **Notifications**: Real-time notifications for user interactions
- **User Profiles**: Comprehensive user profiles with activity tracking
- **Admin Dashboard**: Administrative controls for content moderation

### 👥 User Roles
- **Guest**: View questions and answers
- **User**: Create questions, post answers, vote, comment
- **Admin**: Moderate content, manage users, full platform control

### 📝 Rich Text Features
- Bold, Italic, Strikethrough formatting
- Numbered and bulleted lists
- Hyperlink insertion
- Emoji support
- Image embedding
- Text alignment (left, center, right)
- Code blocks and inline code

### 🔔 Notification System
- Answer notifications
- Comment notifications
- Vote notifications
- Answer acceptance notifications
- Real-time unread count
- Notification history

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **TipTap** - Rich text editor
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Headless UI** - Accessible UI components
- **Heroicons** - Icon library
- **date-fns** - Date utilities

## Project Structure

```
stackit/
├── stackit-backend/
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication & validation
│   ├── uploads/          # File uploads directory
│   ├── server.js         # Main server file
│   └── package.json
└── stackit-frontend/
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── contexts/     # React contexts
    │   ├── services/     # API services
    │   └── App.js
    ├── public/
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd stackit-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Update `.env` file with your settings:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/stackit
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - If using local MongoDB:
     ```bash
     mongod
     ```
   - If using MongoDB Atlas, ensure your connection string is correct in `.env`

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd stackit-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The application will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### Questions
- `GET /api/questions` - Get all questions (with pagination, filtering)
- `GET /api/questions/:id` - Get single question with answers
- `POST /api/questions` - Create new question (auth required)
- `PUT /api/questions/:id` - Update question (owner/admin only)
- `DELETE /api/questions/:id` - Delete question (owner/admin only)
- `POST /api/questions/:id/vote` - Vote on question (auth required)

### Answers
- `POST /api/answers` - Create new answer (auth required)
- `PUT /api/answers/:id` - Update answer (owner/admin only)
- `DELETE /api/answers/:id` - Delete answer (owner/admin only)
- `POST /api/answers/:id/vote` - Vote on answer (auth required)
- `POST /api/answers/:id/accept` - Accept answer (question owner only)
- `POST /api/answers/:id/comments` - Add comment to answer (auth required)

### Users
- `GET /api/users/profile/:username` - Get user profile
- `PUT /api/users/profile` - Update profile (auth required)
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)
- `PUT /api/users/:id/status` - Activate/deactivate user (admin only)

### Notifications
- `GET /api/notifications` - Get user notifications (auth required)
- `GET /api/notifications/unread-count` - Get unread count (auth required)
- `PUT /api/notifications/:id/read` - Mark as read (auth required)
- `PUT /api/notifications/mark-all-read` - Mark all as read (auth required)

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/popular` - Get popular tags
- `POST /api/tags` - Create tag (admin only)
- `PUT /api/tags/:id` - Update tag (admin only)
- `DELETE /api/tags/:id` - Delete tag (admin only)

## Usage

### Getting Started
1. **Register/Login**: Create an account or sign in
2. **Browse Questions**: View questions by tags, search, or browse all
3. **Ask Questions**: Click "Ask Question" to create a new post
4. **Answer Questions**: Provide helpful answers to existing questions
5. **Vote & Engage**: Vote on helpful content and engage with the community

### Admin Features
- Access admin dashboard via `/admin` route
- Manage users (activate/deactivate, change roles)
- Moderate content (delete inappropriate questions/answers)
- View platform statistics

### Rich Text Editing
The editor supports:
- **Formatting**: Bold, italic, strikethrough
- **Lists**: Numbered and bulleted lists
- **Links**: Add hyperlinks to external resources
- **Images**: Embed images via URL
- **Code**: Inline code and code blocks
- **Alignment**: Left, center, right text alignment
- **Emojis**: Add emojis to make content more engaging

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email your-email@example.com or open an issue on GitHub.

## Roadmap

- [ ] Real-time notifications with Socket.io
- [ ] Advanced search with Elasticsearch
- [ ] Mobile app development
- [ ] API rate limiting enhancements
- [ ] Content recommendation system
- [ ] Advanced moderation tools
- [ ] Analytics dashboard
- [ ] Multi-language support
