import FiltersOptionsService from "../services/FiltersOptionsService.js";
import handleMongoDBError from "../utils/handleMongoDBError.js";

class FiltersOptionsController{
  
  async getFiltersFields(req, res) {
    try { 

      const filtersOptionsFields = await FiltersOptionsService.getFiltersFields()

      res.status(200).json(filtersOptionsFields);
    } catch(err) {
      handleMongoDBError(err);
    }
  }
}

export default new FiltersOptionsController();