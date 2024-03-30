import mongoose from 'mongoose';

export const _copy = <T extends object>(data: T): T => {
  return JSON.parse(JSON.stringify(data));
};

export const toObjectId = (id: string) => {
  return new mongoose.Types.ObjectId(id);
};
