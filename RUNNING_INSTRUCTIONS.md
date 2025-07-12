# StackIt Q&A Platform - Running Instructions

## Prerequisites
1. **MongoDB**: Must be installed and running on your system
2. **Node.js**: Version 14 or higher
3. **npm**: Comes with Node.js

## Quick Start

### Method 1: Manual Start (Recommended)
Open **TWO** command prompt or PowerShell windows:

**Terminal 1 - Backend:**
```powershell
cd "c:\Users\HP\OneDrive - pdpu.ac.in\Odoo\Round1\stackit-backend"
npm run dev
```
Backend will run on: http://localhost:5000

**Terminal 2 - Frontend:**
```powershell
cd "c:\Users\HP\OneDrive - pdpu.ac.in\Odoo\Round1\stackit-frontend" 
npm start
```
Frontend will run on: http://localhost:3000

### Method 2: Use PowerShell Script
1. Right-click on `start-app.ps1` and select "Run with PowerShell"
2. If prompted about execution policy, type `Y` to allow the script to run

### Prerequisites Check
Before starting, ensure:
1. **MongoDB is installed and running**:
   ```powershell
   # Start MongoDB service (if installed as service)
   net start MongoDB
   
   # OR start MongoDB manually
   mongod
   ```

2. **Node.js and npm are working**:
   ```powershell
   node --version    # Should show v14+ 
   npm --version     # Should show 6+
   ```

## Application URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api

## Test Accounts
You can register new accounts or use these test credentials:

### Regular User
- Email: user@test.com
- Password: password123

### Admin User
- Email: admin@test.com
- Password: admin123

## Features Available

### For All Users (Guest)
- ✅ View all questions
- ✅ Search questions by title/content
- ✅ Filter by tags
- ✅ View question details and answers

### For Registered Users
- ✅ User registration and login
- ✅ Create and edit questions
- ✅ Answer questions with rich text editor
- ✅ Vote on questions and answers
- ✅ Comment on answers
- ✅ Manage personal profile
- ✅ Receive notifications

### For Admins
- ✅ All user features
- ✅ Delete any question/answer
- ✅ Manage user accounts
- ✅ View admin dashboard
- ✅ Moderate content

## Rich Text Editor
The app includes a powerful rich text editor with:
- Bold, italic, underline formatting
- Code blocks and inline code
- Lists (ordered and unordered)
- Links
- Headings
- Block quotes

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is installed and running
   - Check if MongoDB service is started

2. **Port Already in Use**
   - Backend (5000): Stop other applications using port 5000
   - Frontend (3000): Stop other React apps or use a different port

3. **Module Not Found Errors**
   - Run `npm install` in both backend and frontend directories

4. **CORS Errors**
   - Ensure backend is running before starting frontend
   - Check that backend URL in frontend matches (http://localhost:5000)

### Environment Variables
The app uses these default values:
- Backend Port: 5000
- Frontend Port: 3000
- MongoDB URI: mongodb://localhost:27017/stackit
- JWT Secret: your-secret-key (change in production)

## Development
- Backend uses nodemon for auto-restart on changes
- Frontend uses React's development server with hot reload
- Both servers will automatically restart when you make changes

## Production Deployment
1. Set environment variables for production
2. Build frontend: `npm run build` in stackit-frontend
3. Serve frontend build files through backend or separate web server
4. Use PM2 or similar for backend process management
5. Set up proper MongoDB instance (not local)

Enjoy using StackIt! 🚀
