import express from 'express';
import dotenv from 'dotenv';

import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import healthRoutes from './routes/health.route.js';
import { checkHealth } from './controllers/health.controller.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import { app, server } from './lib/socket.js';


dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
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
}));

app.get('/check-health', checkHealth);
app.get('/api/check-health', checkHealth);
app.use('/check-health', healthRoutes);
app.use('/api/check-health', healthRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
    });
}


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});