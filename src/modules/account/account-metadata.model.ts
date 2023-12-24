import { Prop, Schema } from '@nestjs/mongoose';
import {
  BaseDocument,
  EmbeddedDocument,
} from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';
import { IAccountRole } from 'src/shared/types';
import { ERoleRequestStatus } from './types';

@Schema({ _id: false })
export class RoleRequestDocument extends EmbeddedDocument {
  @Prop({ required: true, enum: IAccountRole, default: IAccountRole.USER })
  role: IAccountRole;

  @Prop({ required: true, default: Date.now() })
  requestedAt: Date;

  @Prop({ required: true })
  reason: string;

  @Prop({
    required: true,
    enum: ERoleRequestStatus,
    default: ERoleRequestStatus.PENDING,
  })
  status: ERoleRequestStatus;
}

@Schema(DefaultSchemaOptions)
export class AccountMetadataDocument extends BaseDocument {
  @Prop({ required: true })
  userId: string;

  @Prop({
    type: RoleRequestDocument.schema,
    required: false,
  })
  roleRequest?: RoleRequestDocument;
}
