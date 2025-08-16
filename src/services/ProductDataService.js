import ProductModel from "../models/ProductModel.js";
import validateProduct from "../utils/validateProduct.js";
import applyQueryOptions from "../utils/applyQueryOptions.js";
import fileService from './FileService.js';

import parseMultipartBody from '../utils/multipartBodyParser.js'

import {z} from 'zod'
import path from "path";

class ProductDataService{

  async create(productData, reqFile) {
    try {

      let uploadResult = null;
      let publicId = null;

      const parsedBody = parseMultipartBody(productData)
      const validProduct = validateProduct(parsedBody);

      if(reqFile) {
        uploadResult = await fileService.saveFile(reqFile.buffer);
        publicId = uploadResult.public_id;
      }

      const product = new ProductModel({
        ...validProduct,
        image: uploadResult.url,
        public_id: publicId,
      });
      await product.save();
      return product;

    } catch (err) {
      if(publicId) {
        await fileService.deleteFile(publicId);
      }
      
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
  
  async update(newProductData, id, newFile) {
    try { 
      let uploadResult = null;

      if( (!newProductData || Object.keys(newProductData).length === 0) && !newFile) {
        throw new Error('Nothing to update')
      }

      if(newFile) {
        const oldProductData = await ProductModel.findById(id);
        if(!oldProductData) {
          throw new Error('Product not found')
        }

        uploadResult = await fileService.updateFile(newFile.buffer, oldProductData.public_id);
        newProductData = {
          ...newProductData,
          image: uploadResult.url,
          public_id: uploadResult.public_id,
        }
      }

      const updatedProduct = await ProductModel.findByIdAndUpdate(id, newProductData, {new: true});

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
      
      await fileService.deleteFile(product.public_id);

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