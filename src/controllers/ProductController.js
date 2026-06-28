import ApiError from "../exceptions/ApiError.js";
import productDataService from "../services/ProductDataService.js";

import handleMongoDBError from "../utils/handleMongoDBError.js";

class ProductController{

  async create(req, res) {
    try {
      const product = await productDataService.create(req.body, req.file)
      res.status(201).json(product)
    } catch(err) {
      handleMongoDBError(err);
    }
  }

  async getAll(req, res) {
    try {
      const data = await productDataService.getAll(req.query);
      res.status(200).json(data)
    } catch(err) {
      handleMongoDBError(err);
    }
  }

  async getBatch(req, res) {

    try {
      const idsArray = req.query.ids.split(",");

      if(!idsArray) {
        throw ApiError.badRequest('Bad request: Ids not specified');
      }

      const data = await productDataService.getBatchByIds(idsArray);

      res.status(200).json(data);
    } catch(err) {
      handleMongoDBError(err);
    }
  }

  async getOne(req, res) {
    try{
      const {id} = req.params;

      if(!id) {
        throw ApiError.badRequest('Bad request: Id not specified');
      }
      const product = await productDataService.getOne(id);
      res.json(product)
    } catch(err) {
      handleMongoDBError(err);
    }
  }

  async update(req, res) {
    try { 
      const newProductData = req.body;
      const {id} = req.params;

      if(!id) {
        throw ApiError.badRequest('Bad request: Id not specified');
      }
      const updatedProduct = await productDataService.update(newProductData, id, req.file);
      res.json(updatedProduct)

    } catch(err) {
      handleMongoDBError(err);
    }
  }

  async delete(req, res) {
    try {
      const {id} = req.params;

      if(!id) {
        throw ApiError.badRequest('Bad request: Id not specified');
      }

      const deletedProduct = await productDataService.delete(id);
      res.json(deletedProduct);

    } catch(err) {
      handleMongoDBError(err);
    }
  }
}


export default new ProductController();