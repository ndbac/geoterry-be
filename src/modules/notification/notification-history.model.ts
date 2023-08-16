import { Prop, Schema } from '@nestjs/mongoose';
import {
  BaseDocument,
  EmbeddedDocument,
} from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';

@Schema({ _id: false })
export class MetadataDocument extends EmbeddedDocument {
  @Prop({ required: false })
  title?: string;

  @Prop({ required: false })
  body?: string;

  @Prop({ required: false })
  imageUrl?: string;
}

@Schema(DefaultSchemaOptions)
export class NotificationHistoryDocument extends BaseDocument {
  @Prop({ required: true })
  profileId: string;

  @Prop({ required: true, default: new Date() })
  sentAt: Date;

  @Prop({ type: MetadataDocument.schema })
  metadata: MetadataDocument;
}
