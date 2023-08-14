import { Prop, Schema } from '@nestjs/mongoose';
import { BaseDocument } from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';

@Schema(DefaultSchemaOptions)
export class TerryCategoryDocument extends BaseDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;
}
