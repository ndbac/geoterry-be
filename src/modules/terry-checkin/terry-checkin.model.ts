import { Prop, Schema } from '@nestjs/mongoose';
import {
  BaseDocument,
  EmbeddedDocument,
} from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';

@Schema({ _id: false })
export class LocationDocument extends EmbeddedDocument {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}

@Schema(DefaultSchemaOptions)
export class TerryCheckinDocument extends BaseDocument {
  @Prop({ required: true })
  terryId: string;

  @Prop({ required: true })
  profileId: string;

  @Prop({ required: true, default: new Date() })
  checkinAt: Date;

  @Prop({ required: false })
  reviewText?: string;

  @Prop({ required: false })
  photoUrls?: string[];

  @Prop({ required: false })
  rate?: number;

  @Prop({
    type: LocationDocument.schema,
  })
  location: LocationDocument;
}
