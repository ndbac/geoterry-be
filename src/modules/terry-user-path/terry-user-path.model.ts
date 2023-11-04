import { Prop, Schema } from '@nestjs/mongoose';
import { BaseDocument } from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';

@Schema(DefaultSchemaOptions)
export class TerryUserPathDocument extends BaseDocument {
  @Prop({ required: true })
  terryId: string;

  @Prop({ required: true })
  profileId: string;

  @Prop({ required: false })
  path?: string;
}
