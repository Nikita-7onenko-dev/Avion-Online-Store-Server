import ProductModel from "../models/productModel.js";
import handleMongoDBError from "../utils/handleMongoDBError.js";

class FiltersOptionsService{

  async getFiltersFields() {
      try { 
  
        const [allProductTypes, allCategories, allDesigners] = await Promise.all([
          ProductModel.distinct('productType'),
          ProductModel.distinct('category'),
          ProductModel.distinct('designer')
        ])
  
        return {allProductTypes, allCategories, allDesigners}

      } catch(err) {
        handleMongoDBError(err);
      }
  }
}

export default new FiltersOptionsService()