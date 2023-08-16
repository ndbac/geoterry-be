import { DefaultSchemaOptions } from '../../shared/mongoose/schema-option';
import { BaseDocument } from '../../shared/mongoose/base.document';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema(DefaultSchemaOptions)
export class DeviceDocument extends BaseDocument {
  @Prop({ required: true })
  profileId: string;

  @Prop({ required: true })
  fcmToken: string;

  @Prop({ required: true, default: true })
  enabled: boolean;
}
