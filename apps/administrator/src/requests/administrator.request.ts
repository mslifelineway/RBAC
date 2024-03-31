import { RequestActionsEnum } from '@app/common';
import { Administrator } from '../schemas/administrator.schema';
import { Types } from 'mongoose';

export class AdministratorRequest {
  doc: Administrator = new Administrator();
  constructor(data: any, action: RequestActionsEnum) {
    this.doc._id = data?._id;
    this.doc.firstName = data?.firstName;
    this.doc.lastName = data?.lastName;
    this.doc.email = data?.email;
    this.doc.password = data?.password;
    this.doc.phoneNumber = data?.phoneNumber;
    this.doc.image = data?.image;
    this.doc.role = data?.role;

    this.doc.isActive = data?.isActive;

    this.doc.createdAt = data?.createdAt;
    this.doc.updatedAt = new Date();

    switch (action) {
      case RequestActionsEnum.CREATE:
        this.doc._id = new Types.ObjectId();
        this.doc.createdAt = new Date();

        break;

      case RequestActionsEnum.UPDATE:
        break;

      case RequestActionsEnum.UPDATE_STATUS:
        this.doc.isActive = !data?.isActive;
        break;

      case RequestActionsEnum.RECOVER:
        this.doc.isActive = true;
        this.doc.isDeleted = false;
        break;

      case RequestActionsEnum.DELETE:
        this.doc.isActive = false;
        this.doc.isDeleted = true;
        break;
    }
  }
}
