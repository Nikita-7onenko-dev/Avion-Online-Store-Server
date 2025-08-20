import  jwt  from "jsonwebtoken";
import tokenModel from "../models/tokenModel.js";
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

      const token = tokenModel.create({refreshToken, userId})
    } catch(err) {
      handleMongoDBError(err);
    }
  }
}

export default new TokenService();