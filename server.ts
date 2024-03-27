import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes'
import messageRoutes from './routes/message.routes'
import userRoutes from './routes/user.routes'

import connectMongoDB from './db/connectMongoDb';
import { app, server } from './socket/socket';


const cors = require('cors');
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json()); // to parse the incoming request with JSON payload from req.body
app.use(cookieParser());
app.use(cors());
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)

// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello World!');
// });


server.listen(PORT, () => {
    connectMongoDB();
    console.log(`Server running on port ${PORT}`)
});
