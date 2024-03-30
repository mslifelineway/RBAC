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
    if (data) {
      this.doc._id = data._id;
      this.doc.name = data.name;
      this.doc.description = data.description;
      this.doc.isActive = data.isActive;

      this.doc.createdAt = data.createdAt;
      this.doc.updatedAt = data.updatedAt;
      this.doc.createdBy = data.createdBy;
      this.doc.updatedBy = data.updatedBy;

      switch (action) {
        case RequestActionsEnum.CREATE:
          this.doc._id = new Types.ObjectId();
          this.doc.createdBy = administrator._id;
          this.doc.updatedBy = administrator._id;
          this.doc.createdAt = new Date();
          this.doc.updatedAt = new Date();
          break;
        case RequestActionsEnum.DELETE:
          this.doc.isActive = false;
          this.doc.updatedBy = administrator._id;
          this.doc.updatedAt = new Date();
          break;
        case RequestActionsEnum.UPDATE:
          this.doc.updatedBy = administrator._id;
          this.doc.updatedAt = new Date();
          break;
        case RequestActionsEnum.UPDATE_STATUS:
          this.doc.isActive = !data.isActive;
          this.doc.updatedBy = administrator._id;
          this.doc.updatedAt = new Date();
          break;
        case RequestActionsEnum.RESTORE:
          this.doc.isActive = true;
          this.doc.updatedBy = administrator._id;
          this.doc.updatedAt = new Date();
          break;
      }
    }
  }
}
