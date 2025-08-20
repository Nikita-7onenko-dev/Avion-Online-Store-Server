import { Router } from "express";
import userController from "../controllers/userController.js";

const router = new Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users/all', userController.getAllUsers);


export default router;