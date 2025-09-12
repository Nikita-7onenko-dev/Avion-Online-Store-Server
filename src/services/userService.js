import userModel from "../models/UserModel.js";
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import mailService from "./mailService.js";

import tokenService from "./tokenService.js";
import UserDto from '../dtos/UserDto.js'
import ApiError from "../exceptions/ApiError.js";
import handleMongoDBError from "../utils/handleMongoDBError.js";


class UserService{

  async register(userData) {
    try {
      const {email, password, username, phone} = userData;
      const candidate = await userModel.findOne({email: email});
      if(candidate) {
        throw ApiError.badRequest(`Bad request: User with email:${email} has already been registered`);
      }
      const hashPassword = await bcrypt.hash(password, 4);

      const activationLink = randomBytes(16).toString('hex');

      const user = await userModel.create({email, password: hashPassword, username, phone, activationLink });

      await mailService.sendActivationToMail(email, `${process.env.API_URL}api/activate/${activationLink}`);

      const userDto = new UserDto(user);

      const payload = {
        _id: userDto._id,
        username: userDto.username,
        email: userDto.email,
        role: userDto.role
      }
      const tokens = tokenService.generateTokens(payload);

      await tokenService.saveToken(userDto._id, tokens.refreshToken);

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

  async login(email, password) {

    try{
      const user = await userModel.findOne({email: email});
      if(!user) {
        throw ApiError.badRequest(`Bad request: No user found with this ${email}`)
      }

      const isEqualPassword = await bcrypt.compare(password, user.password);
      if(!isEqualPassword) {
        throw ApiError.badRequest(`Bad request: Wrong password`)
      }

      const userDto = new UserDto(user);
      const tokens = tokenService.generateTokens({...userDto});
      await tokenService.saveToken(userDto._id, tokens.refreshToken)

      return {...tokens, user: userDto}

    } catch(err) {
      handleMongoDBError(err);
    }
  }

  async logout(refreshToken) {
    try {
      const result = await tokenService.removeToken(refreshToken);
      return result;
    } catch(err) {
      handleMongoDBError(err)
    }
  }

  async refresh(refreshToken) {
    try{
      if(!refreshToken) {
        throw ApiError.unauthorizedError()
      }

      const userData = tokenService.verifyRefreshToken(refreshToken);
      const tokenFromDb = await tokenService.findToken(refreshToken);
      if(!userData || !tokenFromDb) {
        throw ApiError.unauthorizedError()
      }
      const user = await userModel.findById(userData._id)

      const userDto = new UserDto(user);
      
      const tokens = tokenService.generateTokens({...userDto});
      await tokenService.saveToken(userDto._id, tokens.refreshToken)

      return {...tokens, user: userDto}
    } catch(err) {
      handleMongoDBError(err);
    }
  }

  async updateUserData(userData) {
    try {
       const {
        _id,
        email, 
        oldPassword, 
        newPassword,
        ...otherFields
      } = userData;

      const user = await userModel.findById(_id);
      if(!user) {
        throw ApiError.unauthorizedError();
      }
    
      const updateData = Object.fromEntries(
        Object.entries(otherFields).filter(([k, v]) => {
          if(k === 'password' || k === 'confirmPassword' || k === 'oldPassword') {
            return v;
          } else return true  
        })
      );

      if(user.email !== email) {
        console.log(email)
        const activationLink = randomBytes(16).toString('hex');
        await mailService.sendActivationToMail(email, `${process.env.API_URL}api/activate/${activationLink}`);
        updateData.email = email;
        updateData.isActivated = false;
        updateData.activationLink = activationLink;
      }

      if (newPassword && newPassword.trim() !== "") {
        const isEqualPassword = await bcrypt.compare(oldPassword, user.password);
        if(!isEqualPassword) {
          throw ApiError.unauthorizedError();
        }
        updateData.password = await bcrypt.hash(newPassword, 4);
      }

      const newUserData = await userModel.findOneAndUpdate(
        {email: user.email}, 
        {$set: updateData }, 
        {new: true}
      );

      const userDto = new UserDto(newUserData);
      return userDto

    } catch(err) {
      handleMongoDBError(err)
    }
  }

  
}

export default new UserService()