import { Prop, Schema } from '@nestjs/mongoose';
import {
  BaseDocument,
  EmbeddedDocument,
} from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';

@Schema({ _id: false })
export class CoordinateDocument extends EmbeddedDocument {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}

@Schema(DefaultSchemaOptions)
export class TerryUserPathDocument extends BaseDocument {
  @Prop({ required: true })
  terryId: string;

  @Prop({ required: true })
  profileId: string;

  @Prop({ required: false, type: [CoordinateDocument.schema] })
  coordinates?: CoordinateDocument[];
}
