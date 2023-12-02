import { Prop, Schema } from '@nestjs/mongoose';
import { BaseDocument } from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';

@Schema(DefaultSchemaOptions)
export class TerryUserMappingDocument extends BaseDocument {
  @Prop({ required: true })
  terryId: string;

  @Prop({ required: true })
  profileId: string;

  @Prop({ required: false })
  rate?: number;

  @Prop({ required: false })
  checkedIn?: boolean;

  @Prop({ required: false })
  favourite?: boolean;

  @Prop({ required: false })
  saved?: boolean;

  @Prop({ required: false })
  path?: string;
}
