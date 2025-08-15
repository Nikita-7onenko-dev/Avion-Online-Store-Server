import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path'

import productRoutes from './routes/products.js'
import ProductModel from './models/ProductModel.js';


dotenv.config();
const uri = `mongodb+srv://AvionDaddy:${process.env.MONGO_PASSWORD}@aviononlinestorecluster.zgbkepg.mongodb.net/?retryWrites=true&w=majority&appName=AvionOnlineStoreCluster`;
const PORT = 5000;
const app = express();


app.use(express.json());
app.use('/products', productRoutes);
app.use('/static', express.static(path.resolve('static')))

async function startApp() {
  try {
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

startApp()
