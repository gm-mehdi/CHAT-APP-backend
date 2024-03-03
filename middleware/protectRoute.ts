import jwt from "jsonwebtoken";
import User from "../models/user.model";

const protectRoute = async (req: any, res: any, next: any) => {
    try {

        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided " });
        }

        const JWT_SECRET : string = process.env.JWT_SECRET!;
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid token " });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized - No User found " });
        }

        req.user = user; 
        next();

        
    } catch (error: any) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({ error: `${error.message}` })
    }
}

export default protectRoute;