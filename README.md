# 🎉 Evente Booking System

A modern, full-stack event booking application built with React, Node.js, and MongoDB. Features real-time seat availability, advanced filtering, responsive design, and seamless booking experience.

## 🌟 Features

### 🎯 Core Functionality
- **Event Management**: Create, view, and manage events
- **Real-time Booking**: Instant seat availability updates
- **Advanced Search & Filtering**: Search by title, location, date with smart filters
- **User Authentication**: Secure login and registration system
- **Admin Dashboard**: Comprehensive event and booking management
- **Responsive Design**: Perfect experience on all devices

### 🎨 User Experience
- **Modern UI**: Glassmorphism design with smooth animations
- **Portal-based Dropdowns**: No clipping issues, perfect visibility
- **Real-time Updates**: Instant seat count updates without page refresh
- **Smart Search**: Field-specific and global search capabilities
- **Interactive Filters**: Unified dropdown filtering system

### 🛠️ Technical Features
- **React Context**: State management across components
- **Framer Motion**: Smooth animations and transitions
- **Tailwind CSS**: Modern, responsive styling
- **MongoDB**: Scalable database solution
- **RESTful API**: Clean and efficient backend architecture

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Evente-Booking-System
```

### 2. Install Dependencies

#### Server Dependencies
```bash
cd server
npm install
```

#### Client Dependencies
```bash
cd ../client
npm install
```

### 3. Environment Setup

#### Server Environment Variables
Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/evente-booking
# OR for MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/evente-booking

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

#### Client Environment Variables
Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Database Setup

#### Option 1: Local MongoDB
```bash
# Start MongoDB service
mongod

# Create database (optional - will be created automatically)
mongo
use evente-booking
```

#### Option 2: MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Add it to your server `.env` file

### 5. Run the Application

#### Start the Server
```bash
cd server
npm run dev
```
Server will run on `http://localhost:5000`

#### Start the Client
```bash
cd client
npm start
```
Client will run on `http://localhost:3000`

## 📁 Project Structure

```
Evente-Booking-System/
├── client/                 # React Frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/       # React Context
│   │   ├── pages/         # Page components
│   │   ├── api/           # API configuration
│   │   └── App.js         # Main App component
│   └── package.json
├── server/                # Node.js Backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── package.json
├── README.md
└── .gitignore
```

## 🔧 Development Scripts

### Server Scripts
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run tests
```

### Client Scripts
```bash
npm start            # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run eject        # Eject (one-way operation)
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/checkauth` - Check authentication status

### Events
- `GET /api/event/get-events` - Get all events
- `GET /api/event/get-admin-events` - Get admin events
- `POST /api/event/create-event` - Create new event
- `PUT /api/event/update-event/:id` - Update event
- `DELETE /api/event/delete-event/:id` - Delete event

### Bookings
- `POST /api/booking/` - Create booking
- `GET /api/booking/get-bookings` - Get user bookings
- `GET /api/booking/get-admin-bookings` - Get admin bookings

## 🎨 Key Components

### Frontend Components
- **Navbar**: Navigation with authentication
- **EventCard**: Event display with booking info
- **EventsPage**: Event listing with search & filters
- **EventDetails**: Detailed event view & booking
- **AdminHome**: Admin dashboard
- **BookingSuccess**: Booking confirmation modal

### Backend Models
- **User**: User authentication and profile
- **Event**: Event details and availability
- **Booking**: Booking records and management

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **CORS Protection**: Cross-origin resource sharing
- **Input Validation**: Server-side validation
- **Rate Limiting**: Prevent abuse (implement as needed)

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
# Check if MongoDB is running
brew services list | grep mongodb  # macOS
sudo systemctl status mongod        # Linux

# Start MongoDB service
brew services start mongodb        # macOS
sudo systemctl start mongod        # Linux
```

#### 2. Port Already in Use
```bash
# Find process using port
lsof -i :5000   # Server
lsof -i :3000   # Client

# Kill process
kill -9 <PID>
```

#### 3. Environment Variables Not Found
```bash
# Verify .env files exist
ls -la server/.env
ls -la client/.env

# Restart services after adding .env files
```

#### 4. CORS Issues
- Ensure `FRONTEND_URL` in server `.env` matches client URL
- Check API URL in client `.env` matches server URL

### Debug Mode

#### Server Debug
```bash
cd server
DEBUG=* npm run dev
```

#### Client Debug
- Open browser developer tools
- Check Network tab for API calls
- Console for JavaScript errors

## 🚀 Deployment

### Production Build

#### Client
```bash
cd client
npm run build
```

#### Server
```bash
cd server
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=your-production-frontend-url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React** - For the amazing frontend framework
- **Node.js** - For the powerful backend runtime
- **MongoDB** - For the flexible database solution
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For the beautiful animations

## 📞 Support

If you have any questions or issues, please:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [Issues](../../issues)
3. Create a new [Issue](../../issues/new) with detailed information

---

**Happy Coding! 🎉**

Made with ❤️ using React, Node.js, and MongoDB
