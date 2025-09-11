import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
        console.log(`MongoDB connected ${conn.connection.host}`)
    }
    catch (error) {
        console.log(`Error: ${error}`)
    }
}

export default connectDB;