Sample Real-Time Chat Application (Socket.IO + Node.js + MongoDB)

A real-time one-to-one chat application built using Node.js, Express, MongoDB, Socket.IO, JWT authentication, and Redis.
Supports instant messaging, message persistence, authentication.


![Image Alt](https://github.com/MohanKirar/chat_application/blob/d3f0077db62c4145653687bb511ed2160d9c58ad/screenshot.png)

## Features:

- JWT-based Authentication (Access & Refresh Tokens)
- Real-time messaging using Socket.IO
- One-to-one private chat
- Online message delivery (instant)
- Message persistence using MongoDB
- Redis used for token/session management
- WhatsApp-style UI (Sender / Receiver bubble)
- Secure API with middleware
- Scalable & Clean architecture (SOLID principles)

## Backend Rest APIs

- Node.js + Express REST APIs
- MongoDB with Mongoose
- Socket.io for real-time chat
- Redis
- Swagger API docs
- Docker & Docker Compose
- JWT
- bcrypt

## Frontend

- HTML
- CSS
- Vanilla JavaScript
- Socket.IO Client

## Project Structure

chat-app-rest-api/
│
├── server.js
├── src/
│ ├── config/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ ├── socket/
│ └── utils/
└── package.json

## Frontend

frontend/
│
├── login.html
├── register.html
├── users.html
└── styles.css

## Prerequisites

Make sure you have installed:
Node.js (v18+ recommended)
MongoDB (local or Atlas)
Redis (local or Docker)

## Create .env file

PORT=3000
MONGO_URI=mongodb://localhost:27017/chat-app
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
REDIS_URL=redis://127.0.0.1:6379

#Start Redis
redis-server
OR
docker run -d -p 6379:6379 redis

## Authentication Flow

- User registers / logs in
- Backend returns accessToken & refreshToken
- Token stored in localStorage
- Socket.IO connects using token
- User joins personal room using userId
- Messages delivered in real time

## Security Notes

- Passwords hashed using bcrypt
- JWT validation middleware
- Redis used for token/session control
- Socket events scoped by user room

# Chat Application Backend (Docker Ready)

## Run with Docker

docker compose up --build

## Swagger

http://localhost:3000/api-docs

## ------ Author ----------

Mohan Kumar
Linked in: https://www.linkedin.com/in/mohankirar
