import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import productRouter from './routes/productsRouter.js';
import filtersOptionsRouter from './routes/filtersOptionsRouter.js';
// import authRouter from './routes/authRouter.js';

import ProductModel from './models/ProductModel.js';
import cloudinaryConfig from './cloudinary.js';


function devOrigins(origin, callback) {
    const allowedOrigins = process.env.DEV_ORIGINS.split(',');

      if(!origin) return callback(null, true);
      if(allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback( new Error('not allowed by CORS'));
      }
}


async function startApp() {

  dotenv.config();

  console.log("Starting server...");
  console.log("PORT:", process.env.PORT);
  
  const uri = `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_PASSWORD}@aviononlinestorecluster.zgbkepg.mongodb.net/?retryWrites=true&w=majority&appName=AvionOnlineStoreCluster`;
  const PORT = process.env.PORT || 5000;
  const app = express();
  
  app.use(express.json());
  app.use(cookieParser());



  app.use(cors({
    origin: process.env.IS_DEV === 'true' ? devOrigins : "https://nikita-7onenko-dev.github.io/Avion-Online-Store/",
    credentials: true,
  }))




  app.use('/api/products', productRouter);
  app.use('/api/filtersOptions', filtersOptionsRouter);
  // Keep Alive
  app.get('/ping', (req, res) => res.status(200).json('pong'));
  // app.use('/api/auth', authRouter);

  try {
    cloudinaryConfig();
    await mongoose.connect(uri);
    await ProductModel.init()
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`RUN SERVER ON PORT ${PORT}`);
    })

  } catch(err) {
    console.log(err)
  }
}

startApp();


