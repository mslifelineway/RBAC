import { RequestActionsEnum } from '@app/common';
import { Permission } from '../schemas/permission.schema';
import { Types } from 'mongoose';
import { Administrator } from 'apps/administrator/src/schemas/administrator.schema';

export class PermissionRequest {
  doc: Permission = new Permission();
  constructor(
    data: any,
    action: RequestActionsEnum,
    administrator: Administrator,
  ) {
    this.doc._id = data?._id;
    this.doc.name = data?.name;
    this.doc.description = data?.description;
    this.doc.isActive = data?.isActive;
    this.doc.isDeleted = data?.isDeleted;

    this.doc.createdAt = data?.createdAt;
    this.doc.updatedAt = new Date();
    this.doc.createdBy = data?.createdBy;
    this.doc.updatedBy = administrator._id;

    switch (action) {
      case RequestActionsEnum.CREATE:
        this.doc._id = new Types.ObjectId();
        this.doc.createdBy = administrator._id;
        this.doc.updatedBy = administrator._id;
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
