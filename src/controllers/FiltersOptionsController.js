import FiltersOptionsService from "../services/FiltersOptionsService";


class FiltersOptionsController{
  
  async getFiltersFields(req, res) {
    try { 

      const filtersOptionsFields = await FiltersOptionsService.getFiltersFields()

      res.status(200).json(filtersOptionsFields);
    } catch(err) {
      res.status(500).json({error: err.message})
    }
  }
}

export default new FiltersOptionsController();