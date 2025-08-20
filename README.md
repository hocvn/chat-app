# Chat App  
A modern fullstack chat application built with React, Vite, Node.js, Express, Socket.io, MongoDB, and Tailwind CSS. Real-time messaging, authentication, and a beautiful UI.

Clone from this [project](https://github.com/burakorkmez/fullstack-chat-app), repo of `burakorkmez`

## Features
- Real-time chat with Socket.io
- User authentication (sign up, login)
- Responsive and modern UI (Tailwind CSS)
- Profile management
- Chat rooms and direct messaging
- Avatar support
- Light/dark theme toggle
## Technologies Used
- Frontend: React, Vite, Tailwind CSS, Axios
- Backend: Node.js, Express, Socket.io, MongoDB (Mongoose)
- Other: Cloudinary (image upload), JWT (authentication)

## Project Structure
```
chat-app/  
├── backend/      # Node.js/Express/Socket.io API
├── frontend/     # React/Vite client
└── README.md     # Project documentation
```

## Getting Started
Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

**1. Clone the repository**

```
git clone https://github.com/hocvn/chat-app.git
cd chat-app
```
**2. Setup Backend**
```
cd backend
npm install
# Create a .env file (see .env.example if available)  
npm start  
```
**3. Setup Frontend**
```
cd frontend
npm install
npm run dev 
``` 
**4. Access the App** 

- Frontend: http://localhost:5173  
- Backend API: http://localhost:5000  
## Environment Variables
Configure your backend `.env` file with:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT authentication
- `CLOUDINARY_URL` - Cloudinary API URL

### Scripts
- Backend: `npm start` (starts Express server)
- Frontend: `npm run dev` (starts Vite dev server)

### License

MIT
