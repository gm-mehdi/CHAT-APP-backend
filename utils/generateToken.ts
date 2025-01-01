import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config();

const generateTokenAndSetCookie = (userId: any, res: any) => {
    const JWT_SECRET: string = process.env.JWT_SECRET!;
    const token = jwt.sign(
        { userId }, JWT_SECRET, {
        expiresIn: '15d',
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //milliseconds
        httpOnly: true, //prevet XSS attacks cross-site scripting attacks
        sameSite: "strict", //CSRF attack cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    });
}

export default generateTokenAndSetCookie;