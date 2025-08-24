import express from 'express';
import filtersOptionsController from "../controllers/FiltersOptionsController.js";


const router = express.Router();

router.get('/', filtersOptionsController.getFiltersFields);

export default router;