import mongoose from 'mongoose';

export const _copy = <T extends object>(data: T): T => {
  return JSON.parse(JSON.stringify(data));
};

export const toObjectId = (id: string) => {
  return new mongoose.Types.ObjectId(id);
};

export const generateUniqueString = (length: number = 8) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
};
