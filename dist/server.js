"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const connectMongoDb_1 = __importDefault(require("./db/connectMongoDb"));
const socket_1 = require("./socket/socket");
const cors = require('cors');
const PORT = process.env.PORT || 5000;
dotenv_1.default.config();
socket_1.app.use(express_1.default.json()); // to parse the incoming request with JSON payload from req.body
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use(cors());
socket_1.app.use("/api/auth", auth_routes_1.default);
socket_1.app.use("/api/messages", message_routes_1.default);
socket_1.app.use("/api/users", user_routes_1.default);
// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello World!');
// });
socket_1.server.listen(PORT, () => {
    (0, connectMongoDb_1.default)();
    console.log(`Server running on port ${PORT}`);
});
