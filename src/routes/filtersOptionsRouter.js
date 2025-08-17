import express from 'express';
import FiltersOptionsController from "../controllers/FiltersOptionsController.js";


const router = express.Router();

router.get('/', FiltersOptionsController.getFiltersFields);

export default router;