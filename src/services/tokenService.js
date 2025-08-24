import  jwt  from "jsonwebtoken";
import tokenModel from "../models/TokenModel.js";
import handleMongoDBError from "../utils/handleMongoDBError.js";

class TokenService{

  generateTokens(payload) {

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: "30m"})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: "30d"})

    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(userId, refreshToken) {
    try{
      const tokenData = await tokenModel.findOne({userId});

      if(tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
      }
      
      await tokenModel.create({refreshToken, userId});
    } catch(err) {
      handleMongoDBError(err);
    }
  }

  async removeToken(refreshToken) {
    try{
      const tokenData = await tokenModel.deleteOne({refreshToken});
      return tokenData;
    } catch(err) {
      handleMongoDBError(err);
    }
  }

  async findToken(refreshToken) {
    try{
      const tokenData = await tokenModel.findOne({refreshToken});
      return tokenData;
    } catch(err) {
      handleMongoDBError(err);
    }
  }

  verifyRefreshToken(token) {
    try{
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      return userData;
    } catch(err) {
      return null;
    }
  }

  verifyAccessToken(token) {
    try{
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData;
    } catch(err) {
      return null;
    }
  }
}

export default new TokenService();