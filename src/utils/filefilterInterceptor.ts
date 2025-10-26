// import { diskStorage } from 'multer';

// export const fileFilterInterceptor = (params: {
//   allowedTypes: string[];
//   req: Request;
//   file: Express.Multer.File;
//   callback: (error: Error | null, acceptFile: boolean) => void;
//   is_optional?: boolean;
// }) => {
//   const { file, callback, allowedTypes, is_optional } = params;
//   if (is_optional && !file) {
//     // If the file is optional and not provided, accept it
//     callback(null, true);
//     return;
//   }

//   // Check if the file is a PDF
//   const fileNameExtension = file.mimetype.split('/')[1];
//   // Check if the file type is allowed
//   if (!allowedTypes.includes(fileNameExtension)) {
//     // If the file type is not allowed, reject it
//     callback(
//       new Error(
//         `Invalid file type. Allowed types are: ${allowedTypes.join(', ')}`,
//       ),
//       false,
//     );
//   }
//   // If the file is valid, accept it
//   callback(null, true);
// };

// // : (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => void
// export const fileNamer = (
//   file: Express.Multer.File,
//   isOptional?: boolean,
// ): string => {
//   if (isOptional && !file) {
//     // If the file is optional and not provided, return a default name or empty string
//     return '';
//   }
//   const fileExtension = file.mimetype.split('/')[1];
//   const originalName = file.originalname.split('.')[0];
//   const fileName = `${originalName}-${Date.now()}.${fileExtension}`;
//   return fileName;
// };

// export const distStorageUploads = diskStorage({
//   destination: './uploads',
//   filename: (req, file, cb) => {
//     cb(null, `${fileNamer(file)}`);
//   },
// });

// export const calculateLimitFileSize = (megabytes) => {
//   const bytes = megabytes * 1024 * 1024; // Convert megabytes to bytes
//   return bytes;
// };
