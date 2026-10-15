# Chattap — Real-Time Chat Application

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite Version](https://img.shields.io/badge/Vite-6-646cff.svg)](https://vitejs.dev/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101.svg)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-DaisyUI_4-38bdf8.svg)](https://daisyui.com/)

A modern, fullstack real-time 1-to-1 chat platform built with React 19, Vite, Node.js (ES Modules), Express, Socket.IO, MongoDB, DaisyUI, and Tailwind CSS. Features full-duplex messaging, live online presence tracking, Cloudinary media sharing, 32 customizable themes, and a dynamic interactive landing page.

Inspired by [burakorkmez/fullstack-chat-app](https://github.com/burakorkmez/fullstack-chat-app).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API & WebSocket Specification](#api--websocket-specification)
  - [REST Endpoints](#rest-endpoints)
  - [Socket.IO Events](#socketio-events)
- [Design & Theming](#design--theming)
- [Health Monitoring & Deployment](#health-monitoring--deployment)
- [License](#license)

---

## Features

### 🌟 Interactive Landing Page
- **Hero & Value Proposition**: Engaging typography, ambient light effects, and live stat counters.
- **Interactive Chat Sandbox**: Simulated live chat window allowing visitors to send test messages, view attachments, and observe real-time responses before signing up.
- **Live 32-Theme Switcher**: Instant theme preview on the landing page powered by DaisyUI CSS variables.
- **Feature Bento Grid & Tech Matrix**: Visual walkthrough of core system capabilities and fullstack monorepo technologies.

### 💬 Instant 1-to-1 Messaging
- **Full-Duplex WebSockets**: Sub-second message delivery powered by Socket.IO with automatic reconnection and fallback.
- **Offline Persistence**: Messages are stored in MongoDB with chronological sorting (`createdAt: 1`) so conversations are preserved across sessions.
- **Image Attachments**: Send photos and screenshots inline, uploaded directly to Cloudinary CDN with preview thumbnails and cancel controls before sending.

### 🟢 Live Presence & Contact Directory
- **Online Indicators**: Real-time green indicator rings and badges showing active contacts.
- **Online Filter**: Sidebar toggle allowing users to filter contacts to show only connected users.
- **Dynamic Presence Sync**: Global `getOnlineUsers` socket broadcasts update across all active clients immediately upon connection or disconnect.

### 🎨 32 Curated Themes
- **DaisyUI Theme Integration**: Choose from 32 distinct visual presets (e.g., `coffee`, `synthwave`, `cyberpunk`, `luxury`, `dracula`, `cupcake`, `emerald`, `retro`, `dark`, `light`).
- **Real-Time Preview**: Settings page with mock conversation view to preview color schemes before applying.
- **Persistence**: Selections are saved to `localStorage` (`chat-theme`) and synced to `document.documentElement` (`data-theme`).

### 🔒 Authentication & Profile Security
- **JWT & HTTP-Only Cookies**: Secure, stateless session tokens immune to client-side script theft (`httpOnly`, `sameSite: strict`).
- **Encrypted Credentials**: Password hashing via `bcryptjs` with 10 salt rounds.
- **Profile Customization**: Users can update their avatar picture, with images processed and hosted via Cloudinary.
- **Route Protection**: Automatic guards redirect unauthenticated requests to the landing page or login, and authenticated users to the chat dashboard.

### 🩺 Health Checks & Production Monitoring
- Dedicated `/check-health` and `/api/check-health` endpoints for uptime monitoring and load balancer readiness checks.

---

## Tech Stack

| Layer | Technologies | Key Role |
|---|---|---|
| **Frontend** | React 19, Vite 6, Tailwind CSS, DaisyUI 4 | Modern declarative UI, instant HMR, utility styling, 32 themes |
| **State & Networking** | Zustand 5, Axios, Socket.IO Client 4 | Lightweight hook state management, HTTP client with credentials |
| **Icons & Alerts** | Lucide React, React Hot Toast | Clean SVG iconography, customizable toast notifications |
| **Backend** | Node.js (ESM), Express 4 | High-performance asynchronous REST API server |
| **Real-Time Engine**| Socket.IO 4 | Duplex WebSocket server with user ID mapping |
| **Database & ODM** | MongoDB, Mongoose 8 | Document storage for users and message histories |
| **Media Hosting** | Cloudinary SDK v2 | Direct cloud media uploads, optimization, and CDN delivery |
| **Security** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cookie-parser` | Stateless token auth, salted password hashing |

---

## Monorepo Structure

```
chat-app/
├── package.json              # Monorepo root scripts (build & start)
├── README.md                 # Project overview and instructions
├── AGENTS.md                 # Agent guidelines and git workflow conventions
├── PLAN.md                   # Implementation roadmap and validation tracking
├── docs/
│   ├── SPEC.md               # Product & system specification
│   └── ARCHITECTURE.md       # Technical architecture and design decisions
├── backend/
│   ├── package.json          # Backend dependencies & scripts
│   ├── .env                  # Environment configuration
│   └── src/
│       ├── index.js          # Express app entry, static serving, socket initialization
│       ├── controllers/      # Auth, message, and health route controllers
│       ├── middleware/       # JWT protectRoute middleware
│       ├── models/           # Mongoose schemas (User, Message)
│       ├── routes/           # Express router definitions
│       ├── seed/             # Database seed utilities
│       └── lib/              # Cloudinary, DB, socket, utils, and CORS resolution
└── frontend/
    ├── package.json          # Frontend dependencies & scripts
    ├── vite.config.js        # Vite build configuration
    ├── tailwind.config.js    # Tailwind CSS + 32 DaisyUI themes config
    ├── index.html            # Single Page Application HTML entry
    └── src/
        ├── App.jsx           # Main router and authentication gate
        ├── main.jsx          # React DOM entry point
        ├── components/       # UI components (Navbar, Sidebar, ChatContainer, etc.)
        ├── pages/            # LandingPage, HomePage, LoginPage, SignUpPage, ProfilePage, SettingsPage
        ├── store/            # Zustand stores (useAuthStore, useChatStore, useThemeStore)
        ├── constants/        # Theme definitions
        └── lib/              # Axios instance and date utilities
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**
- **MongoDB**: Local MongoDB instance or free cloud cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Cloudinary Account**: Free account on [Cloudinary](https://cloudinary.com) for image storage

### Installation & Setup

**1. Clone the repository**
```bash
git clone https://github.com/hocvn/chat-app.git
cd chat-app
```

**2. Setup Backend**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [Environment Variables](#environment-variables)).

Start the backend development server:
```bash
npm run dev
# Server runs on http://localhost:3000
```

**3. Setup Frontend**
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
# Client runs on http://localhost:5173
```

**4. Access the Application**
- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Unauthenticated visitors will see the **Landing Page**.
- Click **Get Started** or **Sign In** to access the chat dashboard.

---

## Environment Variables

Configure your `backend/.env` file with the following variables:

```ini
# Server Port
PORT=3000

# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/chat_db?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Environment Mode
NODE_ENV=development

# Optional Frontend URL (defaults to localhost:5173 in development)
CLIENT_URL=http://localhost:5173
```

---

## Available Scripts

### Monorepo Root
- `npm run build` — Installs dependencies and builds the production bundle for both frontend and backend.
- `npm start` — Starts the backend server in production mode.

### Backend (`/backend`)
- `npm run dev` — Starts the Node.js server with `nodemon` for auto-restart on file changes.
- `npm start` — Starts the Node.js server using `node src/index.js`.

### Frontend (`/frontend`)
- `npm run dev` — Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build` — Compiles and optimizes assets into `frontend/dist/`.
- `npm run lint` — Runs ESLint across all React components and stores.
- `npm run preview` — Previews the production build locally.

---

## API & WebSocket Specification

### REST Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/check-health` | No | Server uptime check (returns status, uptime, timestamp) |
| `GET` | `/api/check-health` | No | Alias for `/check-health` under API prefix |
| `POST` | `/api/auth/signup` | No | Register new user account (`username`, `fullname`, `email`, `password`) |
| `POST` | `/api/auth/login` | No | Authenticate credentials and receive `httpOnly` JWT cookie |
| `POST` | `/api/auth/logout` | No | Clear authentication cookie |
| `GET` | `/api/auth/check-auth` | Yes (JWT) | Validate active token and return authenticated user object |
| `PUT` | `/api/auth/update-profile` | Yes (JWT) | Upload base64 image avatar to Cloudinary and update profile |
| `GET` | `/api/messages/users` | Yes (JWT) | Fetch all registered contacts for the sidebar (excluding current user) |
| `GET` | `/api/messages/:id` | Yes (JWT) | Retrieve chronological message history between current user and `:id` |
| `POST` | `/api/messages/send/:id` | Yes (JWT) | Send text and/or image attachment to user `:id` |

### Socket.IO Events

- **Connection**:
  - Connect to `ws://<host>:<port>` with query param `?userId=<mongo_user_id>`.
  - The server maps `socket.id` to the user ID and broadcasts presence.
- **`getOnlineUsers`** (Server -> All Clients):
  - Emitted whenever a user connects or disconnects.
  - Payload: `string[]` (array of online user IDs).
- **`newMessage`** (Server -> Recipient Socket):
  - Emitted when a new message is saved and the recipient is online.
  - Payload: `Message` document (`_id`, `senderId`, `receiverId`, `text`, `image`, `createdAt`).

---

## Design & Theming

Chattap features 32 DaisyUI themes:
`light`, `dark`, `cupcake`, `bumblebee`, `emerald`, `corporate`, `synthwave`, `retro`, `cyberpunk`, `valentine`, `halloween`, `garden`, `forest`, `aqua`, `lofi`, `pastel`, `fantasy`, `wireframe`, `black`, `luxury`, `dracula`, `cmyk`, `autumn`, `business`, `acid`, `lemonade`, `night`, `coffee`, `winter`, `dim`, `nord`, `sunset`.

Theme state is managed through Zustand (`useThemeStore`) and persisted in `localStorage`.

---

## Health Monitoring & Deployment

Chattap is deployment-ready for platforms like **Render**, **Railway**, or **Fly.io**:

1. In production (`NODE_ENV=production`), Express statically serves the compiled frontend assets from `frontend/dist`.
2. Any unmatched route serves `index.html` to enable client-side React Router navigation.
3. Health check endpoints `/check-health` and `/api/check-health` return:
   ```json
   {
     "status": "ok",
     "message": "Chat App Backend is running smoothly",
     "uptime": 124.5,
     "timestamp": "2026-10-15T04:00:00.000Z"
   }
   ```

---

## License

This project is licensed under the [MIT License](LICENSE).
