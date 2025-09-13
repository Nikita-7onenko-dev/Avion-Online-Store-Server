import userService from "../services/userService.js";
import {z} from 'zod';

import handleMongoDBError from "../utils/handleMongoDBError.js";
import ApiError from "../exceptions/ApiError.js";
import validateUserData from "../utils/validateUserData.js";
import tokenService from "../services/tokenService.js";

class UserController{

  async register(req, res) {
    try{
      const {email, password, username, ...rest} = validateUserData(req.body);
      const userData = await userService.register({email, password, username, ...rest});

      res.cookie(
        'refreshToken', 
        userData.refreshToken, 
        {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: "none"}
      );

      res.status(201).json({...userData.user});
    } catch(err) {
      if (err instanceof z.ZodError) {
        throw ApiError.badRequest("Validation failed", err);
      }
      handleMongoDBError(err);
    }
  }

  async activate(req, res) {
    try{
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(`${process.env.CLIENT_URL}#/profile`);
    } catch(err) {
      handleMongoDBError(err);
    }
  }

  async login(req, res) {
    try{
      const {email, password} = validateUserData(req.body);
      const userData = await userService.login(email, password);

      res.cookie(
        'refreshToken', 
        userData.refreshToken, 
        {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: "none"}
      );

      res.status(200).json({...userData.user, accessToken: userData.accessToken});

    } catch(err) {
      if (err instanceof z.ZodError) {
        throw ApiError.badRequest("Validation failed", err);
      }
      handleMongoDBError(err);
    }
  }
  
  async logout(req, res) {
    try{
      const {refreshToken} = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      if(!token) {
        throw ApiError.badRequest("Bad request: there is no active session")
      }
      res.status(200).json('OK');
    } catch(err) {
      handleMongoDBError(err);
    }
  }

  async refresh(req, res) {
    try{
      const {refreshToken} = req.cookies;

      const userData = await userService.refresh(refreshToken);

      res.cookie(
        'refreshToken', 
        userData.refreshToken, 
        {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: "none"}
      );

      res.status(200).json({...userData.user, accessToken: userData.accessToken});

      
    } catch(err) {
      handleMongoDBError(err);
    }
  }

  async updateUserData(req, res) {
    try {

      const {email, password, username, accessToken, ...rest} = validateUserData(req.body);

      const userData = await userService.updateUserData({email, password, username, ...rest});

      userData.accessToken = accessToken;

      res.status(200).json({...userData})

    } catch(err) {
       if (err instanceof z.ZodError) {
        throw ApiError.badRequest("Validation failed", err);
      }
      handleMongoDBError(err);
    }
  } 

  async getAllUsers(req, res, next) {
    try{

    } catch(err) {
      handleMongoDBError(err);
    }
  }
}


export default new UserController();