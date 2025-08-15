import fs from 'fs';
import path from 'path';
import { randomUUID } from "crypto";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000"

class FileService{

  saveFile(tempPath, originalname) {
    const ext = path.extname(originalname);
    const fileName = randomUUID() + ext;
    const filePath = path.resolve( 'static', fileName );

    if (!fs.existsSync("static")) {
      fs.mkdirSync("static");
    }

    fs.renameSync(tempPath, filePath);

    return `${BASE_URL}/static/${fileName}`;
  }

  updateFile(oldFilePath, newTempPath) {
    try {
      if(!fs.existsSync(oldFilePath)) {
        throw new Error(`Old file does not exist: ${oldFilePath}`)
      }
      if (!fs.existsSync(newTempPath)) {
        throw new Error(`New file does not exist: ${newTempPath}`);
      }

      fs.copyFileSync(newTempPath, oldFilePath);
      fs.unlinkSync(newTempPath);

    } catch(err) {
      throw err
    }
  }

  deleteFile(filePath) {
    try {
      if(!fs.existsSync(filePath)) {
        throw new Error(`file does not exist: ${filePath}`)
      }
      fs.unlinkSync(filePath);

    } catch(err) {
      throw err
    }
  }
}



export default new FileService()