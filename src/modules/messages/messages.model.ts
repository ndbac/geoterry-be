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

  @Prop({ type: String })
  text: string;

  @Prop({ required: false })
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

  @Prop({ type: Boolean })
  sentByRecipient: boolean;
}
