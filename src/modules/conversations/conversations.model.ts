import { Prop, Schema } from '@nestjs/mongoose';
import {
  BaseDocument,
  EmbeddedDocument,
} from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';

@Schema({ _id: false })
export class LastMsgDocument extends EmbeddedDocument {
  @Prop({ required: true })
  snippet: string;

  @Prop({ required: true })
  sentAt: Date;

  @Prop({ required: true })
  sentByProfileId: string;
}

@Schema(DefaultSchemaOptions)
export class ConversationDocument extends BaseDocument {
  @Prop({
    type: LastMsgDocument.schema,
    required: false,
  })
  lastMsg: LastMsgDocument;

  @Prop({ type: [String] })
  participants: string[];

  @Prop({ type: Number, default: 0 })
  unreadMsgCnt: number;

  @Prop({ type: Number, default: 0 })
  msgCount: number;
}
