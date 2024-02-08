import { Prop, Schema } from '@nestjs/mongoose';
import {
  BaseDocument,
  EmbeddedDocument,
} from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';
import { MongoLocationType } from 'src/shared/mongoose/types';

@Schema({ _id: false })
export class MetadataDocument extends EmbeddedDocument {
  @Prop({ required: false })
  size?: number;

  @Prop({ required: false })
  difficulty?: number;

  @Prop({ required: false })
  terrain?: number;
}

@Schema({ _id: false })
export class LocationDocument extends EmbeddedDocument {
  // GeoJSON Point
  @Prop({ default: MongoLocationType.POINT })
  type: MongoLocationType;

  // [longitude, latitude]
  @Prop({ required: true })
  coordinates: number[];
}

@Schema({ _id: false })
export class AddressDocument extends EmbeddedDocument {
  @Prop({ type: String })
  administrativeArea?: string;

  @Prop({ type: String })
  country?: string;

  @Prop({ type: String })
  subAdministrativeArea?: string;

  @Prop({ type: String })
  name?: string;
}

@Schema(DefaultSchemaOptions)
export class TerryDocument extends BaseDocument {
  @Prop({ required: true })
  profileId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  hint?: string;

  @Prop({
    type: AddressDocument.schema,
  })
  address: AddressDocument;

  @Prop({ type: [String] })
  photoUrls?: string[];

  @Prop({ type: [String] })
  categoryIds?: string[];

  @Prop({ required: true })
  isAvailable: boolean;

  @Prop({ type: Boolean })
  isOfficial?: boolean;

  @Prop({ type: String })
  code?: string;

  @Prop({
    type: LocationDocument.schema,
  })
  location: LocationDocument;

  @Prop({
    type: MetadataDocument.schema,
  })
  metadata?: MetadataDocument;
}
