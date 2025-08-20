import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import mailService from "./mailService.js";

import tokenService from "./tokenService.js";
import UserDto from '../dtos/UserDto.js'
import ApiError from "../exceptions/ApiError.js";
import handleMongoDBError from "../utils/handleMongoDBError.js";


class UserService{

  async register(email, password) {
    try {

      const candidate = await userModel.findOne({email: email});
      if(candidate) {
        throw ApiError.badRequest(`Bad request: User with email:${email} has already been registered`);
      }
      const hashPassword = await bcrypt.hash(password, 4);

      const activationLink = randomBytes(16).toString('hex');

      const user = await userModel.create({email, password: hashPassword, activationLink });

      await mailService.sendActivationToMail(email, `http://localhost:5000/api/activate/${activationLink}`);

      const userDto = new UserDto(user);

      const tokens = tokenService.generateTokens({...userDto});
      await tokenService.saveToken(userDto._id, tokens.refreshToken)

      return {...tokens, user: userDto}

    } catch(err) {
      handleMongoDBError(err);
    }
  }

  async activate(activationLink) {
    try {
      const user = await userModel.findOne({activationLink});
      if(!user) {
        throw ApiError.badRequest('Bad request: Invalid activation Link')
      }

      user.isActivated = true;
      await user.save();
    } catch (err) {
      handleMongoDBError(err);
    }
  }

}

export default new UserService()