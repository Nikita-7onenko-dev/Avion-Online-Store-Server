import ProductModel from "../models/ProductModel.js";

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
        throw new Error(err.message || String(err));
      }
  }
}

export default new FiltersOptionsService()