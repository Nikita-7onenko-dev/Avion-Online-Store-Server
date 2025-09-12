import ApiError from "../exceptions/ApiError.js";
import tokenService from "../services/tokenService.js";


export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if(!token) {
    throw ApiError.unauthorizedError();
  }

  const userData = tokenService.verifyAccessToken(token);
  if(!userData) {
    throw ApiError.unauthorizedError();
  } 

  req.body = {...req.body, _id: userData._id, accessToken: token}

  next();
  
}