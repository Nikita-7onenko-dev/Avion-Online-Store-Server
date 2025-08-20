import express from 'express';
import filtersOptionsController from "../controllers/filtersOptionsController.js";


const router = express.Router();

router.get('/', filtersOptionsController.getFiltersFields);

export default router;