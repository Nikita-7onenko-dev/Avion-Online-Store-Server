import { v2 as cloudinary } from 'cloudinary';
import streamFileUpload from '../utils/streamFileUpload.js';

const BASE_URL = process.env.BASE_URL || "http://localhost:5000"

class FileService{

  async saveFile(buffer) {
    try {
      const uploadResult = await streamFileUpload(buffer);
      return uploadResult;
    } catch(err) {
      throw err
    }
  }

  async updateFile(newFileBuffer, oldFilePublicId) {
    try {

      const destroyRes = await cloudinary.uploader.destroy(oldFilePublicId);
      console.log('Destroy result:', destroyRes);

      const uploadResult = await streamFileUpload(newFileBuffer);
      console.log('Upload result:', uploadResult);
      return uploadResult


    } catch(err) {
      throw err
    }
  }

  async deleteFile(public_id) {
    try {
      if(!public_id) {
        throw new Error(`public_id does not exist`)
      }
      let destroyRes = await cloudinary.uploader.destroy(public_id);
      console.log('Destroy result:', destroyRes);
    } catch(err) {
      throw err
    }
  }
}



export default new FileService()