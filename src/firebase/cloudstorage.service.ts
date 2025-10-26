// src/firebase/firebase.service.ts
import { Injectable, Logger } from '@nestjs/common';

import { FirebaseService } from './firebase.service';

@Injectable()
export class CloudStorageService {
  constructor(private readonly firebaseService: FirebaseService) {}
  private readonly logger = new Logger(CloudStorageService.name);
  // async uploadTemporalMulterToFirestorage(params: {
  //   file: Express.Multer.File;
  //   firestorage_path: string;
  //   bucket_name?: (typeof enumBucket.enumValues)[number];
  //   location_temporal_file_server_path?: string;
  //   contentType: 'application/pdf' | 'image/jpeg' | 'image/png';
  //   meta_data: Record<string, any>;
  // }): Promise<{
  //   url: string;
  //   path: string;
  //   bucket: (typeof enumBucket.enumValues)[number];
  //   cloud_provider_bucket: (typeof enumBucketProvider.enumValues)[number];
  // }> {
  //   const {
  //     file,
  //     bucket_name,
  //     location_temporal_file_server_path = 'uploads',
  //     firestorage_path, // Incluye filename y extension.
  //     contentType,
  //     meta_data,
  //   } = params;
  //   try {
  //     if (!firestorage_path.includes('.')) {
  //       this.logger.error(
  //         'El path de Firestorage debe incluir el nombre del archivo y su extension',
  //       );
  //       throw new InternalServerErrorException(
  //         'El path de Firestorage debe incluir el nombre del archivo y su extension',
  //       );
  //     }
  //     const filePath = join(
  //       process.cwd(),
  //       location_temporal_file_server_path,
  //       file.filename,
  //     );
  //     const destination = `${firestorage_path}`;
  //     const bucketName = bucket_name || this.firebaseService.default_bucket;
  //     const bucket = this.firebaseService.getBucket(bucketName);
  //     await bucket.upload(filePath, {
  //       destination,
  //       metadata: {
  //         contentType,
  //         ...meta_data,
  //       },
  //     });

  //     // Elimina el archivo temporal
  //     unlinkSync(filePath);

  //     // Obtener URL firmada (opcional)
  //     const [url] = await bucket.file(destination).getSignedUrl({
  //       action: 'read',
  //       expires: Date.now() + 1000 * 60 * 60 * 48, // 48h
  //     });

  //     return {
  //       url,
  //       path: destination,
  //       bucket: bucketName,
  //       cloud_provider_bucket: 'cloud_storage',
  //     };
  //   } catch (error) {
  //     this.logger.error('Error uploading file to Firebase:', error);
  //     throw new InternalServerErrorException(
  //       `
  //       Error uploading file to Firebase: ${file ? file.filename : ''}`,
  //     );
  //   }
  // }

  // async deleteFromStorage(params: {
  //   path: string;
  //   bucket_name?: (typeof enumBucket.enumValues)[number];
  // }) {
  //   try {
  //     const { bucket_name, path } = params;
  //     if (!path) {
  //       throw new InternalServerErrorException(
  //         'Path is required to delete file',
  //       );
  //     }
  //     const bucket = this.firebaseService.getBucket(
  //       bucket_name || this.firebaseService.default_bucket,
  //     );
  //     const file = bucket.file(path);
  //     await file.delete();
  //     this.logger.log(
  //       `File deleted successfully from Firebase Storage: ${path}`,
  //     );
  //     return true;
  //   } catch (error) {
  //     this.logger.error(`Error deleting file from Firebase Storage: ${error}`);
  //     throw new InternalServerErrorException(
  //       `Error deleting file from Firebase Storage`,
  //     );
  //   }
  // }
  // async getFileAsBase64FromStorage(params: {
  //   path: string;
  //   bucket_name?: (typeof enumBucket.enumValues)[number];
  // }): Promise<string> {
  //   const { path, bucket_name } = params;
  //   // 1. Descargar el archivo como buffer
  //   const bucket = this.firebaseService.getBucket(
  //     bucket_name || this.firebaseService.default_bucket,
  //   );
  //   const file = bucket.file(path);
  //   const [buffer] = await file.download();

  //   // 2. Obtener contentType del archivo (puedes hacerlo con file.getMetadata)
  //   const [metadata] = await file.getMetadata();
  //   const contentType = metadata.contentType;

  //   // 3. Convertir a base64
  //   const base64 = buffer.toString('base64');
  //   return `data:${contentType};base64,${base64}`;
  // }

  // async uploadBufferToFirebaseStorage(params: {
  //   buffer: Buffer;
  //   path: string;
  //   contentType: string;
  //   bucket_name?: (typeof enumBucket.enumValues)[number];
  // }): Promise<{
  //   url: string;
  //   path: string;
  //   cloud_provider_bucket: (typeof enumBucketProvider.enumValues)[number];
  //   size: number;
  //   bucket: (typeof enumBucket.enumValues)[number];
  // }> {
  //   const { buffer, path, contentType, bucket_name } = params;
  //   try {
  //     const bucket = this.firebaseService.getBucket(
  //       bucket_name || this.firebaseService.default_bucket,
  //     );
  //     const file = bucket.file(path);
  //     await file.save(buffer, {
  //       contentType,
  //     });
  //     this.logger.log(
  //       `File uploaded successfully to Firebase Storage: ${path}`,
  //     );
  //     return {
  //       url: await this.getPublicURLFromFirebaseStorage({ path }),
  //       path: path,
  //       bucket: bucket_name || this.firebaseService.default_bucket,
  //       cloud_provider_bucket: 'cloud_storage',
  //       size: buffer.length,
  //     };
  //   } catch (error) {
  //     this.logger.error('Error uploading buffer to Firebase:', error);
  //     throw new InternalServerErrorException(
  //       `Error uploading buffer to Firebase: ${path}`,
  //     );
  //   }
  // }

  // async getPublicURLFromFirebaseStorage(params: {
  //   path: string;
  // }): Promise<string> {
  //   const { path } = params;
  //   try {
  //     const bucket = this.firebaseService.getBucket();
  //     const file = bucket.file(path);
  //     const [url] = await file.getSignedUrl({
  //       action: 'read',
  //       expires: Date.now() + 1000 * 60 * 60 * 24, // 24h
  //     });
  //     return url;
  //   } catch (error) {
  //     this.logger.error(
  //       'Error getting public URL from Firebase Storage:',
  //       error,
  //     );
  //     throw new InternalServerErrorException(
  //       `Error getting public URL from Firebase Storage: ${path}`,
  //     );
  //   }
  // }

  // async getBufferFromFirebaseStorage(params: {
  //   path: string;
  //   bucket_name?: (typeof enumBucket.enumValues)[number];
  // }): Promise<Buffer> {
  //   const { path, bucket_name } = params;
  //   try {
  //     const bucket = this.firebaseService.getBucket(
  //       bucket_name || this.firebaseService.default_bucket,
  //     );
  //     const file = bucket.file(path);
  //     const [buffer] = await file.download();
  //     return buffer;
  //   } catch (error) {
  //     this.logger.error('Error getting buffer from Firebase Storage:', error);
  //     throw new InternalServerErrorException(
  //       `Error getting buffer from Firebase Storage: ${path}`,
  //     );
  //   }
  // }
}
