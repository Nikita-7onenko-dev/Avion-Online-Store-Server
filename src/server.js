import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import productRouter from './routes/productsRouter.js';
import filtersOptionsRouter from './routes/filtersOptionsRouter.js';
import authRouter from './routes/authRouter.js';

import productModel from './models/productModel.js';
import cloudinaryConfig from './cloudinaryConfig.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import ApiError from './exceptions/ApiError.js';

dotenv.config();

function devOrigins(origin, callback) {
  const allowedOrigins = process.env.DEV_ORIGINS.split(',');
  if(!origin) return callback(null, true);
  
  if(allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback( new Error('not allowed by CORS'));
  }
}

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

  app.use('/api', authRouter);
  // Keep Alive
  app.get('/ping', (req, res) => res.status(200).json('pong'));
  app.use(errorMiddleware)


async function startApp() {

  console.log("Starting server...");
  console.log("PORT:", process.env.PORT);
  
  const mongoUri = `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_PASSWORD}@aviononlinestorecluster.zgbkepg.mongodb.net/?retryWrites=true&w=majority&appName=AvionOnlineStoreCluster`;

  try {
    cloudinaryConfig();
    await mongoose.connect(mongoUri);
    await productModel.init();
    console.log('MongoDB connected');
    
    app.listen(PORT, () => {
      console.log(`RUN SERVER ON PORT ${PORT}`);
    })

  } catch(err) {
    console.error('Failed to start app:', err);
    process.exit(1);
  }
}

startApp();


