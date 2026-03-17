# Real-Time MERN Chat Application

A full-stack, real-time chat application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.io. This project features a highly responsive, modern UI with a dark glassmorphism theme, real-time messaging, typing indicators, and user presence tracking.

## 🚀 Features

- **Authentication & Authorization**: Secure user registration and login using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Real-Time Messaging**: Built with Socket.io for instant message delivery without refreshing the page.
- **Online/Offline Status**: Real-time tracking of connected users via WebSockets.
- **Typing Indicators**: See when the person you are chatting with is typing.
- **Last Message Preview**: Sidebar automatically updates to show the latest message exchanged with each user.
- **Premium UI/UX**: Designed with a sleek, dark aesthetic using Tailwind CSS (v4), featuring custom scrollbars, glass-panel effects (`backdrop-blur`), dynamic radial backgrounds, and subtle micro-animations.
- **Responsive Design**: Fully mobile-responsive layout.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS v4
- React Router DOM
- Axios
- Socket.io-client
- React Hot Toast (Notifications)
- Lucide React (Icons)
- Context API (State Management)

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- Socket.io
- JSON Web Tokens (JWT)
- bcryptjs
- CORS

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

## ⚙️ Installation & Setup

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd Chat_app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the `backend` directory and add the following variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/chat-app  # Replace with your MongoDB URI if using Atlas
   PORT=5001                                     # Or your preferred port
   JWT_SECRET=your_super_secret_jwt_key
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

## 🏃‍♂️ Running the Application

You will need two separate terminal windows to run the frontend and backend simultaneously.

**Terminal 1: Start the Backend Server**
```bash
cd backend
npm run dev
```
*The server will typically start on `http://localhost:5001` (or whichever port is defined in your `.env`).*

**Terminal 2: Start the Frontend Application**
```bash
cd frontend
npm run dev
```
*Vite will typically start the React app on `http://localhost:5173`. If port 5173 is in use, it will automatically try the next available port (e.g., 5174).*

## 📖 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user and get a token
- `GET /profile` - Retrieve the currently authenticated user's profile

### User Routes (`/api/users`)
- `GET /` - Get a list of all users (excluding the logged-in user) for the sidebar

### Message Routes (`/api/messages`)
- `GET /:id` - Get chat history between the logged-in user and the specified user `id`
- `POST /send/:id` - Send a message to the specified user `id`

## 🤝 Project Structure

```
Chat_app/
├── backend/
│   ├── config/       # Database configuration
│   ├── controllers/  # Route logic handlers
│   ├── middleware/   # Custom Express middleware (e.g., JWT auth)
│   ├── models/       # Mongoose database schemas
│   ├── routes/       # API route definitions
│   ├── socket/       # Socket.io configuration and event listeners
│   └── server.js     # Main entry point for the backend
│
└── frontend/
    ├── src/
    │   ├── assets/       # Static assets
    │   ├── components/   # Reusable React components (Sidebar, ChatWindow)
    │   ├── context/      # React Contexts (Auth, Chat, Socket)
    │   ├── pages/        # Main application pages (Login, Register, Dashboard)
    │   ├── services/     # API request configuration (Axios instances)
    │   ├── App.jsx       # Routing configuration
    │   └── main.jsx      # React DOM rendering
    ├── index.html        # Vite entry HTML
    └── vite.config.js    # Vite configurations
```
