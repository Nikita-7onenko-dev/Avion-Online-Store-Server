import productDataService from "../services/ProductDataService.js";
import {z} from 'zod'

class ProductController{

  async create(req, res) {
    try {
      const product = await productDataService.create(req.body, req.file)
      console.log(product.description)
      res.status(201).json(product)
    } catch(err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          issues: err.issues
        });
      }

      res.status(400).json({error: err.message})
    }
  }

  async getAll(req, res) {
    try {
      const products = await productDataService.getAll(req.query);
      res.status(200).json(products)
    } catch(err) {
      res.status(500).json({error: err.message})
    }
  }

  async getOne(req, res) {
    try{
      const {id} = req.params;

      if(!id) {
        return res.status(400).json({message: "Id not specified"});
      }
      const product = await productDataService.getOne(id);
      res.json(product)
    } catch(err) {
      res.status( err.message === "Product not found" ? 404 : 500).json(err.message)
    }
  }

  async update(req, res) {
    try { 
      const newProductData = req.body;
      const {id} = req.params;

      if(!id) {
        return res.status(400).json({message: "Id not specified"});
      }
      const updatedProduct = await productDataService.update(newProductData, id, req.file);
      res.json(updatedProduct)

    } catch(err) {
      res.status( err.message === 'Product not found' ? 404 : 500).json(err.message)
    }
  }

  async delete(req, res) {
    try {
      const {id} = req.params;

      if(!id) {
        return res.status(400).json({message: "Id not specified"})
      }

      const deletedProduct = await productDataService.delete(id);
      res.json(deletedProduct);

    } catch(err) {
      res.status(err.message === 'Product not found' ? 404 : 500).json(err.message)
    }
  }
}


export default new ProductController();