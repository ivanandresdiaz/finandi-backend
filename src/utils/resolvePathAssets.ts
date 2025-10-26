import { resolve } from 'path';

export const resolvePathAssets = (path: string): string => {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  const isDev = process.env.NODE_ENV === 'development';
  // se quita ../ del root del proyecto. Porque en el build dist no existe src, entonces, se diminuye la ruta pues se pegara en el dist como si fuera el root
  const newPath = isDev ? path : path.slice(3);
  console.log('newPath', newPath);
  return resolve(__dirname, newPath);
};
