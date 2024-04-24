import { Logger } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

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

export interface ParentChildData<T extends object> {
  children: T[];
}

export const prepareParentChildData = <
  T extends { _id: Types.ObjectId; parent?: Types.ObjectId },
>(
  data: T[] = [],
): ParentChildData<T>[] => {
  const logger = new Logger();

  logger.warn('********** DATA: ', JSON.stringify(data));
  data.sort((a: T, b: T) => {
    if (!a.parent && b.parent) {
      return 1;
    }
    if (a.parent && b.parent) {
      return -1;
    }
    if (a.parent === b.parent) return a._id > b._id ? 1 : -1;
    return a.parent > b.parent ? 1 : -1;
  });
  let idToNodeMap = {};
  let rootNodes: ParentChildData<T>[] = [];

  data.forEach((item) => {
    idToNodeMap[item._id.toString()] = { ...item, children: [] };
    if (item.parent) {
      if (idToNodeMap[item.parent.toString()])
        idToNodeMap[item.parent.toString()].children.push(
          idToNodeMap[item._id.toString()],
        );
      else {
        rootNodes.push({ ...item, children: [] });
      }
    } else {
      rootNodes.push(idToNodeMap[item._id.toString()]);
    }
  });
  return rootNodes;
};
