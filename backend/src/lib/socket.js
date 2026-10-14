import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.CLIENT_URL,
].filter(Boolean);

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (
                process.env.NODE_ENV !== 'production' ||
                allowedOrigins.includes(origin) ||
                allowedOrigins.includes('*')
            ) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// Store online users
const userSocketMap = {};

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // Send online users to all clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap)); 

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })
})

export { io, app, server }