import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import { corsOptions } from './cors.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { createSocketAuthenticator, createUserSocketRegistry } from './socket-auth.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: corsOptions,
});

export function getReceiverSocketId(userId) {
    return getReceiverSocketIds(userId)[0];
}

export function getReceiverSocketIds(userId) {
    return userSocketRegistry.get(userId.toString());
}

const userSocketRegistry = createUserSocketRegistry();

io.use(createSocketAuthenticator({
    verifyToken: (token) => jwt.verify(token, process.env.JWT_SECRET),
    findUserById: (userId) => User.findById(userId).select('_id'),
}));

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    const userId = socket.data.userId;
    userSocketRegistry.add(userId, socket.id);

    // Send online users to all clients
    io.emit('getOnlineUsers', userSocketRegistry.users());

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        userSocketRegistry.remove(userId, socket.id);
        io.emit('getOnlineUsers', userSocketRegistry.users());
    })
})

export { io, app, server }
