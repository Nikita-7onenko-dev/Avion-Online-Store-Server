import ApiError from "../exceptions/ApiError.js";

export default function handleMongoDBError(err) {
  if (err instanceof ApiError) throw err;
  throw ApiError.serviceUnavailable('Service unavailable: mongoDB');
}