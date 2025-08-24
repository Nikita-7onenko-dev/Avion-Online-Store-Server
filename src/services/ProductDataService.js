import ProductModel from "../models/ProductModel.js";
import validateProduct from "../utils/validateProduct.js";
import applyQueryOptions from "../utils/applyQueryOptions.js";
import fileService from './fileService.js';

import parseMultipartBody from '../utils/multipartBodyParser.js'

import {z} from 'zod';
import ApiError from "../exceptions/ApiError.js";

import handleMongoDBError from "../utils/handleMongoDBError.js";

class ProductDataService{

  async create(productData, reqFile) {
    try {

      let uploadResult = null;
      let publicId = null;

      const parsedBody = parseMultipartBody(productData);
      const validProduct = validateProduct(parsedBody);
      const productDataToSave = {...validProduct};

      if(reqFile) {
        uploadResult = await fileService.saveFile(reqFile.buffer);
        publicId = uploadResult.public_id;
        productDataToSave.image = uploadResult.secure_url;
        productDataToSave.public_id = publicId;
      }

      const product = new ProductModel(productDataToSave);
      await product.save();
      return product;

    } catch (err) {
      if(publicId) {
        await fileService.deleteFile(publicId);
        console.log("Abort upload result: OK");
      }      
      if(err instanceof z.ZodError) {
        throw ApiError.badRequest('Validation error: ', err.issues);
      } else if( err.code === 11000) {
        const duplicateField = Object.keys(err.keyValue)[0];
        throw ApiError.badRequest(
          `Bad request: Product with this ${duplicateField} already exists`,
          err.keyValue
        );
      }
      handleMongoDBError(err);
    }
  }
  
  async getAll(reqQueryParams) {

    const {search, filters, sorting, alreadyLoaded, limit} = reqQueryParams;
    const query = ProductModel.find();
    const finalQuery = applyQueryOptions(query, {search, filters, sorting, alreadyLoaded, limit});
    try {
      const products = await finalQuery;
      const hasMore = products.length > limit;
      return {
        hasMore: hasMore,
        products: products.slice(0, limit)
      }
    } catch(err) {
      handleMongoDBError(err);
    }
  }
  
  async getOne(id) {
    try{ 
      const product = await ProductModel.findById(id);

      if(!product) {
        throw ApiError.badRequest('Bad request: Product not found');
      }

      return product;
    } catch(err) {
      handleMongoDBError(err);
    }
  }
  
  async update(newProductData, id, newFile) {
    try { 
      let uploadResult = null;

      if( (!newProductData || Object.keys(newProductData).length === 0) && !newFile) {
        throw ApiError.badRequest('Bad request: Nothing to update');
      }

      if(newFile) {
        const oldProductData = await ProductModel.findById(id);
        if(!oldProductData) {
          throw ApiError.badRequest('Bad request: Product not found');
        }

        uploadResult = await fileService.updateFile(newFile.buffer, oldProductData.public_id);
        newProductData = {
          ...newProductData,
          image: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        }
      }

      const updatedProduct = await ProductModel.findByIdAndUpdate(id, newProductData, {new: true});

      if(!updatedProduct) {
        throw ApiError.badRequest('Bad request: Product not found')
      }
      return updatedProduct;

    } catch(err) {

      if (uploadResult?.public_id) {  
        await fileService.deleteFile(uploadResult.public_id);
        console.log("Abort upload result: OK");
      }
      handleMongoDBError(err);
    }
  }
  
  async delete(id) {
    try {

      const product = await ProductModel.findById(id);
      if (!product) {
        throw ApiError.badRequest('Bad request: Product not found');
      }
      
      await fileService.deleteFile(product.public_id);

      const deletedProduct = await ProductModel.findByIdAndDelete(id)

      if(!deletedProduct) {
        throw ApiError.badRequest('Bad request: Product not found');
      }
      return deletedProduct;

    } catch(err) {
      handleMongoDBError(err);
    }
  }
  
}


export default new ProductDataService();