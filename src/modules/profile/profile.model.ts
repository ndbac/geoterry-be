import { Prop, Schema } from '@nestjs/mongoose';
import {
  BaseDocument,
  EmbeddedDocument,
} from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';
import { MongoLocationType } from 'src/shared/mongoose/types';
import { LanguageCode } from 'src/shared/types';

@Schema({ _id: false })
export class LocationDocument extends EmbeddedDocument {
  // GeoJSON Point
  @Prop({ default: MongoLocationType.POINT })
  type: MongoLocationType;

  // [longitude, latitude]
  @Prop({ required: true })
  coordinates: number[];

  @Prop({ required: true, default: Date.now() })
  updatedAt: Date;
}

@Schema(DefaultSchemaOptions)
export class ProfileDocument extends BaseDocument {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  displayName: string;

  @Prop({ type: String })
  bio?: string;

  @Prop({ type: String })
  email?: string;

  @Prop({ type: String })
  phoneNumber?: string;

  @Prop({ required: true })
  slug: string;

  @Prop()
  logoUrl?: string;

  @Prop({ default: LanguageCode.ENGLISH, enum: LanguageCode })
  languageCode: LanguageCode;

  @Prop({ default: 0, required: true })
  rewardPoints: number;

  @Prop({ default: 0, required: true })
  totalCheckedinTerry: number;

  @Prop({
    type: LocationDocument.schema,
  })
  lastLocation?: LocationDocument;
}
