# Dark Futuristic Portfolio

An ultra-modern, dark futuristic developer portfolio website with a complete admin management system.

## 🚀 Features

### Public Portfolio
- 🎨 Jaw-dropping dark futuristic UI with glassmorphism
- ✨ Neon glow effects and smooth animations
- 🎬 Cinematic scroll-based animations with GSAP
- 📱 Fully responsive design
- ⚡ Animated background with particles/gradients
- 🎯 Dynamic content loaded from database

### Admin Panel
- 🔐 Secure JWT authentication
- ➕ Add/Edit/Delete projects
- 🎯 Manage skills with proficiency levels
- ✏️ Update about content and social links
- 📸 Upload and manage images
- 🔄 Real-time updates to public site

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: HTML, CSS, JavaScript, GSAP
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Database**: MongoDB Atlas

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (free tier)
- npm or yarn

## ⚙️ Setup Instructions

### 1. Clone and Install

```bash
# Navigate to project directory
cd portfolio

# Install dependencies
npm install
```

### 2. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or log in
3. Create a new cluster (free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### 3. Environment Configuration

```bash
# Copy the example env file
copy .env.example .env

# Edit .env file and add your MongoDB connection string
```

Update `.env` with your details:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

### 4. Create Default Admin

```bash
# Run the seed script to create default admin
npm run seed
```

Default credentials:
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the password after first login!

### 5. Start the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📱 Access Points

- **Public Portfolio**: http://localhost:5000
- **Admin Login**: http://localhost:5000/admin
- **Admin Dashboard**: http://localhost:5000/admin/dashboard

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

### Projects
- `GET /api/projects` - Get all projects (public)
- `GET /api/projects/:id` - Get single project (public)
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### Skills
- `GET /api/skills` - Get all skills (public)
- `POST /api/skills` - Create skill (protected)
- `PUT /api/skills/:id` - Update skill (protected)
- `DELETE /api/skills/:id` - Delete skill (protected)

### About
- `GET /api/about` - Get about content (public)
- `PUT /api/about` - Update about content (protected)

### Upload
- `POST /api/upload` - Upload image (protected)

## 📁 Project Structure

```
portfolio/
├── models/              # MongoDB schemas
│   ├── Admin.js
│   ├── Project.js
│   ├── Skill.js
│   └── About.js
├── routes/              # API routes
│   ├── auth.js
│   ├── projects.js
│   ├── skills.js
│   ├── about.js
│   └── upload.js
├── middleware/          # Custom middleware
│   └── auth.js
├── scripts/             # Utility scripts
│   └── seedAdmin.js
├── public/              # Frontend files
│   ├── index.html       # Main portfolio page
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   ├── admin/           # Admin panel
│   └── uploads/         # Uploaded images
├── server.js            # Main server file
├── package.json
└── .env                 # Environment variables
```

## 🎨 Customization

1. **Colors**: Edit CSS variables in `public/css/variables.css`
2. **Animations**: Modify GSAP settings in `public/js/animations.js`
3. **Content**: Use the admin panel to manage all content
4. **Background**: Customize in `public/js/background.js`

## 🚀 Deployment

### Backend (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend
The frontend is served by the Express server, so no separate deployment needed.

## 🔒 Security Notes

- Change default admin password immediately
- Use strong JWT_SECRET in production
- Enable HTTPS in production
- Consider rate limiting for API endpoints
- Validate and sanitize all user inputs

## 📝 License

MIT License - feel free to use this for your own portfolio!

## 👤 Author

**M Saad Shaikh**

---

Made with ❤️ and lots of ☕
