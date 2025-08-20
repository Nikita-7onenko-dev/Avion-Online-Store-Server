import userService from "../services/userService.js";
import {z} from 'zod';

import handleMongoDBError from "../utils/handleMongoDBError.js";
import ApiError from "../exceptions/ApiError.js";

class UserController{

  async register(req, res, next) {
    try{

      const registerUserSchema = z.object({
        email: z.email({ message: "Invalid email format" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters" })
      });
      const {email, password} = registerUserSchema.parse(req.body);

      const userData = await userService.register(email, password);

      res.cookie(
        'refreshToken', 
        userData.refreshToken, 
        {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: "none"}
      );

      res.status(200).json({...userData.user, accessToken: userData.accessToken});
    } catch(err) {
      if (err instanceof z.ZodError) {
        return next(ApiError.badRequest("Validation failed", err.errors));
      }
      handleMongoDBError(err);

    }
  }

  async login(req, res, next) {
    try{

    } catch(err) {
      res.status(500).json({error: err.message})
    }
  }
  
  async logout(req, res, next) {
    try{

    } catch(err) {
      res.status(500).json({error: err.message})
    }
  }

  async activate(req, res, next) {
    try{
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL)
    } catch(err) {
      handleMongoDBError(err);
    }
  }

  async refresh(req, res, next) {
    try{

    } catch(err) {
      res.status(500).json({error: err.message})
    }
  }

  async getAllUsers(req, res, next) {
    try{

    } catch(err) {
      res.status(500).json({error: err.message})
    }
  }
}


export default new UserController();