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
  id: string;

  @Prop({ required: true })
  sentAt: Date;

  @Prop({ required: true })
  sentByProfileId: string;
}

@Schema({ _id: false })
export class ParticipantDocument extends EmbeddedDocument {
  @Prop({ required: true })
  profileId: string;

  @Prop({ required: true })
  unreadMsgCnt: number;
}

@Schema(DefaultSchemaOptions)
export class ConversationDocument extends BaseDocument {
  @Prop({
    type: LastMsgDocument.schema,
    required: true,
  })
  lastMsg: LastMsgDocument;

  @Prop({ type: [ParticipantDocument.schema] })
  participants: ParticipantDocument[];

  @Prop({ type: Number, default: 0 })
  msgCount: number;
}
