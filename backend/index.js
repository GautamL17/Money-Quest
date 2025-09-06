import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js';
import bitRoutes from './routes/bitRoutes.js';
import featureRoutes from './routes/featureRoutes.js';
import memeRoutes from './routes/memeRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import userRoutes from './routes/userRoutes.js';
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bits', bitRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/memes', memeRoutes);
app.use('/api/budgets/',budgetRoutes);
app.use('/api/users',userRoutes);
app.get('/', (req, res) => {
    res.end('Hello world');
})
const PORT = process.env.PORT | 8000;
app.listen(PORT, () => console.log(`Server is running at ${PORT}`));