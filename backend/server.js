import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoutes.js';

import { connectDb } from './lib/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/user',userRoutes);


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDb();
})