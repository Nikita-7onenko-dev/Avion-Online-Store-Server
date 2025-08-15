import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier'

export default function streamFileUpload(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "avion_app_uploads" },
      (error, result) => {
        if(result) {
          resolve(result)
        } else {
          reject(error)
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  })
}