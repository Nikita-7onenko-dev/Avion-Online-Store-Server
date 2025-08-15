import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import productRoutes from './routes/products.js'
import ProductModel from './models/ProductModel.js';
import cloudinaryConfig from './cloudinary.js';


async function startApp() {

  dotenv.config();

  console.log("Starting server...");
  console.log("PORT:", process.env.PORT);

  
  const uri = `mongodb+srv://AvionDaddy:${process.env.MONGO_PASSWORD}@aviononlinestorecluster.zgbkepg.mongodb.net/?retryWrites=true&w=majority&appName=AvionOnlineStoreCluster`;
  const PORT = process.env.PORT || 5000;
  const app = express();
  
  app.use(express.json());
  app.use(cors({
    origin: 'http://localhost:8080'
  }))
  app.use('/products', productRoutes);
  
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


