import { Prop, Schema } from '@nestjs/mongoose';
import { BaseDocument } from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';

@Schema(DefaultSchemaOptions)
export class TerryReportDocument extends BaseDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  terryId: string;

  @Prop({ required: true })
  profileId: string;

  @Prop({ required: true })
  description: string;
}
