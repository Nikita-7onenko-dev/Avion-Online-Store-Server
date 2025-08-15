import ProductModel from "../models/ProductModel.js";
import validateProduct from "../utils/validateProduct.js";
import applyQueryOptions from "../utils/applyQueryOptions.js";
import fileService from './FileService.js';

import parseMultipartBody from '../utils/multipartBodyParser.js'

import {z} from 'zod'
import path from "path";

class ProductDataService{

  async create(productData, productImage) {
    try {

      let imagePath = null;

      if(productImage) {
        imagePath = fileService.saveFile(productImage.path, productImage.originalname)
      }
      const parsedBody = parseMultipartBody(productData)
      const validProduct = validateProduct(parsedBody);
      const product = new ProductModel({
        ...validProduct,
        image: imagePath
      });
      await product.save();
      return product;

    } catch (err) {
      if(err instanceof z.ZodError) {
        throw err
      } else if( err.code === 11000) {
        throw new Error('This product already exists');
      }

      throw new Error( err instanceof Error ? err.message : String(err));
    }
  }
  
  async getAll(reqQueryParams) {

    const {search, filters, sorting, alreadyLoaded, limit} = reqQueryParams;
    const query = ProductModel.find();
    const finalQuery = applyQueryOptions(query, {search, filters, sorting, alreadyLoaded, limit});
    try {
      const products = await finalQuery;
      return products;
    } catch(err) {
      throw new Error( err instanceof Error ? err.message : String(err));
    }
  }
  
  async getOne(id) {
    try{ 
      const product = await ProductModel.findById(id);

      if(!product) {
        throw new Error('Product not found')
      }

      return product;
    } catch(err) {
      throw new Error( err instanceof Error ? err.message : String(err));
    }
  }
  
  async update(product, newFile) {
    try { 

      if(newFile) {
        const oldFilePath = path.resolve('static', path.basename(product.image));
        fileService.updateFile(oldFilePath, newFile.path)
      }

      const updatedProduct = await ProductModel.findByIdAndUpdate(product._id, product, {new: true});

      if(!updatedProduct) {
        throw new Error('Product not found');
      }

      return updatedProduct;

    } catch(err) {
      throw new Error( err instanceof Error ? err.message : String(err));
    }
  }
  
  async delete(id) {
    try {

      const product = await ProductModel.findById(id);
      if (!product) {
        throw new Error("Product not found");
      }
      
      const filePath = path.resolve('static', path.basename(product.image));
      fileService.deleteFile(filePath);

      const deletedProduct = await ProductModel.findByIdAndDelete(id)

      if(!deletedProduct) {
         throw new Error("Product not found");
      }
     return deletedProduct;

    } catch(err) {
      throw new Error( err instanceof Error ? err.message : String(err));
    }
  }
  
}


export default new ProductDataService();