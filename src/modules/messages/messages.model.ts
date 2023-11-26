import { Prop, Schema } from '@nestjs/mongoose';
import {
  BaseDocument,
  EmbeddedDocument,
} from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';
import { EMessageType } from './types';

@Schema({ _id: false })
export class MessagePayloadDocument extends EmbeddedDocument {
  @Prop({ enum: EMessageType })
  type: EMessageType;

  @Prop({ type: String, required: false })
  text?: string;

  @Prop({ required: false, type: String })
  mediaUrl?: string;
}

@Schema(DefaultSchemaOptions)
export class MessageDocument extends BaseDocument {
  @Prop({
    type: MessagePayloadDocument.schema,
  })
  payload: MessagePayloadDocument;

  @Prop({ type: String })
  conversationId: string;

  @Prop({ type: String })
  senderId: string;

  @Prop({ type: String })
  recipientId: string;
}
