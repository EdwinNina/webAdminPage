import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { createReadStream } from 'streamifier';

@Injectable()
export class ImagesService {

   constructor(
      private configService: ConfigService,
   ) {
      cloudinary.config({
         cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
         api_key: this.configService.get('CLOUDINARY_API_KEY'),
         api_secret: this.configService.get('CLOUDINARY_API_SECRET')
      })
   }

   uploadImage(image: Express.Multer.File, cloudinary_folder: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
      return new Promise((resolve, reject) => {
         const upload = cloudinary.uploader.upload_stream({
            folder: cloudinary_folder
         },(error, response) => {
            if(error) return reject(error)
            resolve(response)
         })
         createReadStream(image.buffer).pipe(upload);
      })
   }

   deleteImage(url_image: string, cloudinary_folder: string): Promise<DeleteResponse>{
      const image = url_image.split('/').at(-1)
      const image_name = image.split('.')[0]
      return cloudinary.uploader.destroy(`${cloudinary_folder}/${image_name}`)
   }
}

interface DeleteResponse {
   result: string
}