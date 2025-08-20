import { v2 as cloudinary } from 'cloudinary';
import streamFileUpload from '../utils/streamFileUpload.js';
import ApiError from '../exceptions/ApiError.js';

class FileService{

  async saveFile(buffer) {
    try {
      const uploadResult = await streamFileUpload(buffer);
      console.log('Upload result: OK ');
      return uploadResult;

    } catch(err) {
      throw ApiError.serviceUnavailable('Cloudinary service is unavailable');
    }
  }

  async updateFile(newFileBuffer, oldFilePublicId) {
    try {
      
      if(oldFilePublicId) {
        const destroyRes = await cloudinary.uploader.destroy(oldFilePublicId);
        console.log('Destroy result:', destroyRes);
      }

      const uploadResult = await streamFileUpload(newFileBuffer);
      console.log('Upload result: OK ');
      return uploadResult;
    } catch(err) {
      throw ApiError.serviceUnavailable('Cloudinary service is unavailable');
    }
  }

  async deleteFile(public_id) {
    try {
      if(!public_id) {
        throw ApiError.internal('Internal server error: public_id does not exist');
      }
      let destroyRes = await cloudinary.uploader.destroy(public_id);
      console.log('Destroy result:', destroyRes);
    } catch(err) {
        throw ApiError.serviceUnavailable('Cloudinary service is unavailable');
    }
  }
}



export default new FileService()