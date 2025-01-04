import { Server } from "socket.io";
import http, { Server as HttpServer } from "http";
import express, { Express } from "express";

const app: Express = express();

const server: HttpServer = http.createServer(app);
const io: Server = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
	},
});

export const getReceiverSocketId = (receiverId: string): string | undefined => {
	return userSocketMap[receiverId];
};

const userSocketMap: Record<string, string> = {}; // {userId: socketId}

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId: string | undefined = Array.isArray(socket.handshake.query.userId) ? socket.handshake.query.userId[0] : socket.handshake.query.userId;
	if (userId) userSocketMap[userId] = socket.id;

	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		if (userId) {
			delete userSocketMap[userId];
		}
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };