import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './database/index.js';

import { PORT, MONGO_URI } from './config/index.js';
import path from 'path';
import userRouter from './routes/userRoute.js';
import watchRouter from './routes/watchRoute.js';
import orderRouter from './routes/orderRoute.js';
import cartRouter from './routes/cartRoute.js';


const app = express(); 

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://wrist-watch-orcin.vercel.app",
    "https://wrist-watch-7pty.vercel.app/"
  ],
  credentials: true, 
}))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


  //DB
  connectDB();

  // Routes
  app.use("/api", userRouter);
  app.use("/api/cart", cartRouter);
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))
  app.use("/api/watches", watchRouter);
  app.use("/api/orders", orderRouter);


app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})