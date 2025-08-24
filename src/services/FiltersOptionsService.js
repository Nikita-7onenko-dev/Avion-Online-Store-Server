import productModel from "../models/productModel.js";
import handleMongoDBError from "../utils/handleMongoDBError.js";

class FiltersOptionsService{

  async getFiltersFields() {
      try { 
  
        const [allProductTypes, allCategories, allDesigners] = await Promise.all([
          productModel.distinct('productType'),
          productModel.distinct('category'),
          productModel.distinct('designer')
        ])
  
        return {allProductTypes, allCategories, allDesigners}

      } catch(err) {
        handleMongoDBError(err);
      }
  }
}

export default new FiltersOptionsService()