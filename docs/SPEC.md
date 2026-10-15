# Chat App — Product & System Specification

A modern, fullstack real-time chat web application. This document describes **what** the product does, its functional requirements, user flows, system guarantees, and API contracts.

---

## 1. Product Overview

The Chat App provides authenticated users with instant 1-to-1 messaging, media sharing, live user presence tracking, user profile management, and custom theme options. Messages and attachments are persisted in a database and synchronized in real time between clients using WebSockets.

---

## 2. Core Features

### 2.1 Authentication & Session Management
- **Sign Up**: New users register with `username`, `fullname`, `email`, and `password` (minimum 6 characters).
- **Log In**: Existing users authenticate with their `username` and `password`.
- **Log Out**: Terminates the session by clearing the authentication token cookie.
- **Session Persistence**: Authentication token is stored in an `httpOnly` secure cookie. The client restores authenticated state on load via `/api/auth/check-auth`.
- **Route Protection**: Unauthenticated requests to protected endpoints or views redirect to the login page. Authenticated users attempting to visit login/signup are redirected to the chat home screen. Unauthenticated visitors accessing the root path (`/`) are presented with the interactive Landing Page.

### 2.2 Interactive Landing Page
- **Product Overview & Demo**: Features a responsive hero banner, interactive simulated chat preview, and bento feature cards.
- **Live Theme Customizer**: Visitors can test and apply DaisyUI themes live from the landing page.
- **Conversion CTAs**: Quick navigation links and buttons driving visitors to registration (`/signup`) or sign in (`/login`).
- **Contact Directory**: Shows all registered users except the currently logged-in user.
- **Online Indicators**: Displays live presence status (online/offline) for each user via green indicators and badges.
- **Online Filter**: Allows filtering contacts to show only currently connected users.
- **Real-Time Presence Updates**: When users connect or disconnect, online status lists update immediately across all clients.

### 2.3 1-to-1 Direct Messaging
- **Conversation Threading**: Select a user to view full historical conversation between the current user and the contact, ordered chronologically.
- **Real-Time Message Delivery**: Messages sent while the recipient is online arrive immediately without polling or page refresh.
- **Offline Persistence**: Messages are saved in MongoDB and retrieved whenever a conversation is opened, ensuring offline users receive all messages upon logging back in.
- **Image Attachments**: Users can attach image files to messages. Images are uploaded to Cloudinary CDN storage and rendered inline in the chat bubble.
- **Message Input Controls**: Includes text input, image file picker, image thumbnail preview with removal action before sending, and keyboard submit (Enter).

### 2.4 Profile Management
- **User Details**: Profile page displays user avatar, full name, username, email, member since date, and account status (Active).
- **Avatar Upload**: Users can select and upload a new profile picture. Images are uploaded to Cloudinary and the user record is updated immediately.

### 2.5 Theme Customization
- **Theme Selection**: Settings page offers multiple visual themes (e.g., light, dark, cupcake, bumblebee, synthwave, halloween, coffee, etc.).
- **Real-Time Preview**: Displays an interactive mock chat preview showing colors and styling before applying.
- **Persistence**: Chosen theme is stored in `localStorage` under `chat-theme` and applied to the root document (`data-theme`).

### 2.6 Server Health Monitoring
- **Health Endpoint**: Dedicated `/check-health` and `/api/check-health` endpoints allowing uptime monitoring, container orchestrators, and load balancers to check server availability.

---

## 3. User Flows

### 3.1 Registration & Onboarding
1. User navigates to `/signup`.
2. Fills in full name, username, email, and password.
3. Client validates inputs (checks field presence, email format, minimum 6 characters password).
4. Submitting dispatches `POST /api/auth/signup`.
5. On success: JWT cookie is set, authentication state is set, socket connects, and user is redirected to `/`.

### 3.2 Login & Authentication Check
1. User navigates to `/login`.
2. Submits username and password via `POST /api/auth/login`.
3. On success: JWT cookie is set, user details stored in client state, socket connection established with `userId`, redirected to `/`.
4. On browser reload: Client calls `GET /api/auth/check-auth`. If valid token exists, session resumes automatically.

### 3.3 Sending & Receiving Messages
1. User selects a contact from the sidebar.
2. Client queries `GET /api/messages/:id` and populates the message pane.
3. User types a message and optionally attaches an image.
4. Sending triggers `POST /api/messages/send/:id`.
5. Server saves message to database, uploads image to Cloudinary if attached, and emits `newMessage` via Socket.IO to the recipient if online.
6. The sender's client appends the new message immediately.
7. The recipient's client receives `newMessage` event; if the sender is currently selected, message is appended to the view.

### 3.4 Profile Picture Update
1. User opens `/profile`.
2. Clicks camera icon to pick an image file.
3. Client converts image to base64 data URL and calls `PUT /api/auth/update-profile`.
4. Server uploads image to Cloudinary, updates `profilePic` on the user document, and returns updated user object.
5. Client updates stored user state and shows success notification.

---

## 4. API & Network Specifications

### 4.1 REST API Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/check-health` | No | Server health check (returns status, message, timestamp) |
| `GET` | `/api/check-health` | No | Alias for `/check-health` under API prefix |
| `POST` | `/api/auth/signup` | No | Register new user account |
| `POST` | `/api/auth/login` | No | Authenticate user credentials and issue JWT cookie |
| `POST` | `/api/auth/logout` | No | Clear authentication cookie |
| `GET` | `/api/auth/check-auth` | Yes (JWT) | Validate active token and return authenticated user |
| `PUT` | `/api/auth/update-profile`| Yes (JWT) | Upload and update user avatar |
| `GET` | `/api/messages/users` | Yes (JWT) | Fetch all users for the sidebar (excluding current user) |
| `GET` | `/api/messages/:id` | Yes (JWT) | Retrieve message history between logged-in user and `:id` |
| `POST` | `/api/messages/send/:id` | Yes (JWT) | Send a text/image message to recipient `:id` |

### 4.2 Real-Time WebSocket Events (Socket.IO)

- **Connection**:
  - Endpoint: `ws://<host>:<port>` (fallback to HTTP long-polling).
  - Handshake Query: `?userId=<mongo_user_id>`.
  - Server registers `socket.id` against `userId` in `userSocketMap`.
- **`getOnlineUsers`** (Server -> All Clients):
  - Emitted upon connection and disconnection.
  - Payload: Array of currently online user IDs `string[]`.
- **`newMessage`** (Server -> Specific Recipient Socket):
  - Emitted when a new message is saved and recipient is currently connected.
  - Payload: `Message` document object (`_id`, `senderId`, `receiverId`, `text`, `image`, `createdAt`).
- **Disconnection**:
  - Server removes user mapping from `userSocketMap` and re-broadcasts `getOnlineUsers`.

---

## 5. Data Models

### 5.1 User
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique identifier |
| `username` | String | Unique username for login |
| `fullname` | String | User's display name |
| `email` | String | Unique email address |
| `password` | String | Salted and hashed password (bcrypt) |
| `profilePic` | String | URL to avatar image (default: empty string) |
| `createdAt` | Date | Account creation timestamp |
| `updatedAt` | Date | Last profile update timestamp |

### 5.2 Message
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique identifier |
| `senderId` | ObjectId (ref: User) | Sender's user ID |
| `receiverId` | ObjectId (ref: User) | Recipient's user ID |
| `text` | String | Message text content (optional if image present) |
| `image` | String | Cloudinary URL for attached image (optional) |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last modification timestamp |

---

## 6. Product Guarantees

1. **Security & Privacy**:
   - Passwords are never stored in plain text (hashed with bcrypt, 10 salt rounds).
   - Passwords are never exposed in user list queries (`.select('-password')`).
   - Authentication tokens are stored in `httpOnly`, `sameSite: strict` cookies to mitigate XSS attacks.
2. **CORS & Credentials**:
   - Cross-Origin Resource Sharing is configured to allow credentials (`withCredentials: true`) from authorized frontend origins (`localhost:5173`, `127.0.0.1:5173`, and `CLIENT_URL`).
3. **Data Integrity & Chronology**:
   - Messages are sorted in ascending order of creation time (`createdAt: 1`).
   - Unique constraints prevent duplicate accounts by username or email.
4. **Resilient Real-time Sync**:
   - Socket connection automatically establishes upon login and tears down cleanly upon logout.
   - Message storage succeeds regardless of whether the recipient is currently online.

---

## 7. Constraints & Boundaries

- **1-to-1 Conversations Only**: Group chats and public channels are not supported in this specification.
- **No Message Mutation**: Once sent, messages cannot be edited or deleted by users.
- **Single Avatar per User**: Profile avatars replace previous images without version history.
- **Client-Side Image Payload**: Attached images are encoded as base64 strings during transit from client to backend server before uploading to Cloudinary.
