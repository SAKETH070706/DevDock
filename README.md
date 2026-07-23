# 🚀 DevDock

> **Code Together. Build Faster.**

DevDock is a browser-based collaborative coding platform that enables developers to create coding rooms, write code together in real time, communicate through live chat, execute programs securely, and collaborate from anywhere.

Built with modern web technologies including **React**, **Node.js**, **Socket.IO**, **Y.js**, **Monaco Editor**, **MongoDB**, and **Redis**, DevDock provides an experience similar to collaborative IDEs while maintaining a lightweight and scalable architecture.

---

# 📌 Features

## 🔐 Authentication

- User Registration
- Email OTP Verification
- Secure Password Creation
- JWT Authentication
- Login
- Forgot Password
- Password Reset
- Protected Routes

---

## 👥 Collaborative Rooms

- Create Coding Rooms
- Join Rooms using Invite Code
- Leave Room
- Host Room Management
- Disband Room
- Online User Tracking

---

## 💻 Code Editor

- Monaco Editor
- Syntax Highlighting
- Multi-language Support
- Real-time Collaborative Editing using **Y.js**
- Cursor Synchronization
- Automatic Document Sync

Supported Languages

- C
- C++
- Java
- Python
- JavaScript

---

## ⚡ Code Execution

Current Version

- Sandbox Execution API

Future Upgrade

- Docker Container Based Execution
- Isolated Runtime Environment
- Secure Execution
- Resource Limits

---

## 💬 Live Chat

- Room Chat
- Instant Messaging
- Socket.IO Communication

---

## 📊 Execution Panel

- Custom Input
- Program Output
- Execution History
- Language Tracking
- User Tracking

---

## 🛠 Tech Stack

### Frontend

- React
- React Router DOM
- Axios
- Monaco Editor
- Y.js
- y-monaco
- CSS

---

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Redis
- Socket.IO
- Nodemailer

---

### Collaboration

- Y.js
- y-websocket
- Socket.IO

---

### Code Execution

Current

- Sandbox Execution API

Future

- Docker
- Docker SDK

---

# 🏗 Architecture

```
                        +------------------+
                        |     React UI     |
                        +--------+---------+
                                 |
                     REST APIs / WebSockets
                                 |
              +------------------+------------------+
              |                                     |
      Express Backend                     Y-WebSocket Server
              |                                     |
              |                            CRDT Synchronization
              |
      +-------+--------+
      |                |
 MongoDB           Redis
      |
      |
Sandbox Execution API
(Future → Docker Containers)
```

---

# 📂 Project Structure

```
DevDock
│
├── Client
│   │
│   ├── public
│   │
│   └── src
│       │
│       ├── assets
│       ├── components
│       │
│       │── auth
│       │── common
│       │── room
│       │── dashboard
│       │
│       ├── context
│       ├── hooks
│       ├── pages
│       ├── services
│       ├── styles
│       ├── utils
│       │
│       ├── App.jsx
│       └── main.jsx
│
│
├── Server
│   │
│   └── src
│       │
│       ├── config
│       ├── controllers
│       ├── middleware
│       ├── models
│       ├── routes
│       ├── services
│       ├── sockets
│       ├── utils
│       └── server.js
│
└── README.md
```

---

# 🔄 Authentication Flow

```
Register
      │
      ▼
Send OTP
      │
      ▼
Verify OTP
      │
      ▼
Set Password
      │
      ▼
Login
      │
      ▼
Dashboard
```

---

# 👥 Room Workflow

```
Login
   │
   ▼
Dashboard
   │
   ├───────────────┐
   ▼               ▼
Create Room     Join Room
   │               │
   └──────┬────────┘
          ▼
 Collaborative Room
          │
          ▼
Real-Time Collaboration
          │
          ▼
Run Code
```

---

# ⚡ Code Execution Workflow

Current

```
Editor
   │
   ▼
Express Backend
   │
   ▼
Sandbox API
   │
   ▼
Execution Output
```

Future

```
Editor
   │
   ▼
Backend
   │
   ▼
Docker Container
   │
   ▼
Output
```

---

# 🔄 Collaboration Workflow

```
User A
      │
      ▼
Monaco Editor
      │
      ▼
Y.js Document
      │
      ▼
Y-WebSocket Server
      │
      ▼
User B
```

---

# 📡 Socket.IO Events

### Rooms

- create-room
- join-room
- leave-room
- disband-room

### Chat

- send-message
- receive-message

### Presence

- user-joined
- user-left
- online-users

---

# 🔗 REST API

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/signup` |
| POST | `/api/auth/verify-otp` |
| POST | `/api/auth/resend-otp` |
| POST | `/api/auth/set-password` |
| POST | `/api/auth/login` |
| POST | `/api/auth/forgot-password` |
| POST | `/api/auth/reset-password` |

---

## Rooms

| Method | Endpoint |
|---------|----------|
| POST | `/api/room/create` |
| POST | `/api/room/join` |
| POST | `/api/room/disband` |
| GET | `/api/room/history` |

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/devdock.git
```

---

## Backend

```bash
cd Server
npm install
```

Create `.env`

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=

EMAIL_USER=

EMAIL_PASS=

REDIS_HOST=

REDIS_PORT=
```

Start Server

```bash
npm run dev
```

---

## Frontend

```bash
cd Client
npm install
npm run dev
```

---



# 🚀 Future Enhancements

- Docker Container Execution
- Shared Cursor Indicators
- Collaborative File Explorer
- Multi-file Projects
- Voice Chat
- Video Calls
- Code Replay
- Theme Customization
- AI Coding Assistant
- Room Templates
- Public Rooms
- Team Workspaces
- GitHub Integration

---

# 👨‍💻 Author

**L GOPALA KRISHNA SAKETH**

Computer Science Undergraduate

Full Stack Developer

GitHub: https://github.com/SAKETH070706


---

# ⭐ Show Your Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
