/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-misused-promises */
import 'reflect-metadata';
import express from 'express';
import socketRouter from './routes/student.routes';
import userSocketRouter from './routes/users.routes';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
const frontendUrl = process.env.FRONTEND_URL!;
const app: express.Application = express();
app.use(cors({ origin: frontendUrl, credentials: true }));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: frontendUrl,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
  }
});
const userSocketMap = new Map<string, string>();
const studentSocketMap = new Map<string, string>();
io.on('connection', (socket) => {
  // console.log(socket.id);
  socket.on('login', (userId: string) => {
    userSocketMap.set(userId, socket.id);
  });
  socket.on('register', (userId: string) => {
    userSocketMap.set(userId, socket.id);
  });
  socket.on('sendMail', (userId: string) => {
    userSocketMap.set(userId, socket.id);
  });
  socket.on('removeStudent', (userId: string) => {
    studentSocketMap.set(userId, socket.id);
  });
  socket.on('updateStudent', (userId: string) => {
    studentSocketMap.set(userId, socket.id);
  });
  socket.on('createStudent', (userId: string) => {
    studentSocketMap.set(userId, socket.id);
  });
});
app.use(cookieParser());
app.use(express.json());
app.use('/students', socketRouter(io, studentSocketMap));
app.use('/users', userSocketRouter(io, userSocketMap));
server.listen(5000, () => {
  console.log('server is running on port: 5000');
});
