import { Prop, Schema } from '@nestjs/mongoose';
import {
  BaseDocument,
  EmbeddedDocument,
} from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';

@Schema({ _id: false })
export class LastMsgDocument extends EmbeddedDocument {
  @Prop({ required: false })
  snippet: number;

  @Prop({ required: false })
  sentAt: Date;

  @Prop({ required: false })
  sentByRecipient: string;
}

@Schema(DefaultSchemaOptions)
export class ConversationDocument extends BaseDocument {
  @Prop({
    type: LastMsgDocument.schema,
  })
  lastMsg?: LastMsgDocument;

  @Prop({ type: String })
  recipientId: string;

  @Prop({ type: String })
  unreadMsgCnt: number;
}
