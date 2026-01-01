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
- **npm** package manager
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
npm init
npm install
```

#### Client Dependencies
```bash
cd ../client
npm init
npm install
```

### 3. Environment Setup

#### Server Environment Variables
Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=8000
NODE_ENV="development"
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/evente-booking

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
```

#### Client Environment Variables
Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL = "http://localhost:8000/"
```

### 4. Run the Application

#### Start the Server
```bash
cd server
npx nodemon
```
Server will run on `http://localhost:8000`

#### Start the Client
```bash
cd client
npm run dev
```
Client will run on `http://localhost:5173`

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
## 🎯 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login

### Events
- `GET /events/get-events` - Get all events
- `GET /events/get-admin-events` - Get admin events
- `POST /events/create-event` - Create new event
- `PUT /events/update-event/:id` - Update event
- `DELETE /events/delete-event/:id` - Delete event

### Bookings
- `POST /booking/` - Create booking
- `GET /booking/get-bookings` - Get user bookings

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

## 🙏 Acknowledgments

- **React** - For the amazing frontend framework
- **Node.js** - For the powerful backend runtime
- **MongoDB** - For the flexible database solution
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For the beautiful animations

**Happy Coding! 🎉**

Made with ❤️ using React, Node.js, and MongoDB
