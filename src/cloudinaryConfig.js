import { v2 as cloudinary } from 'cloudinary';

export default function cloudinaryConfig() {
    cloudinary.config({ 
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
      api_key: process.env.CLOUDINARY_API_KEY, 
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

  // Удаляем все ресурсы
  // cloudinary.api.delete_all_resources(
  //   { all: true }, // подтверждаем удаление всех ресурсов
  //   (error, result) => {
  //     if (error) {
  //       console.error('Ошибка при удалении:', error);
  //     } else {
  //       console.log('Все ресурсы удалены:', result);
  //     }
  //   }
  // );
  

  // Получаем список ресурсов
  // cloudinary.api.resources(
  //   {
  //     type: 'upload',
  //     max_results: 40
  //   },
  //   (error, result) => {
  //     if (error) {
  //       console.error('Ошибка:', error);
  //       return;
  //     }
  //     const cloudFiles = result.resources.map(r => ({
  //       public_id: r.public_id,
  //       format: r.format,
  //       url: r.secure_url
  //     }))
  //     console.log('Количество в облаке:', cloudFiles.length);
  //     console.log('Файлы в облаке:', cloudFiles);
  //   }
  // );
}

