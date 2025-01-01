import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const connectMongoDB = async () => {
    try {
        const MONGO_DBURI: string = process.env.MONGO_DBURI!;
        await mongoose.connect(MONGO_DBURI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
    }   
}; 

export default connectMongoDB;
