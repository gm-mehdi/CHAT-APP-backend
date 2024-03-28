"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateTokenAndSetCookie = (userId, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, {
        expiresIn: '15d',
    });
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //milliseconds
        httpOnly: true, //prevet XSS attacks cross-site scripting attacks
        sameSite: "strict", //CSRF attack cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    });
};
exports.default = generateTokenAndSetCookie;
