import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/authRoute.js';
import { connectDb } from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/api/v1/auth',authRouter);


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDb();
})