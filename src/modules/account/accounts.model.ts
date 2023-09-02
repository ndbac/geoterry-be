import { Prop, Schema } from '@nestjs/mongoose';
import {
  EmbeddedDocument,
  BaseDocument,
} from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';
import { EIdentifierType, IamNamespace } from 'src/shared/types';

@Schema({ _id: false })
export class CredentialsDocument extends EmbeddedDocument {
  @Prop()
  passwordChangedAt: Date;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: false })
  recoveryCode?: string;
}

@Schema(DefaultSchemaOptions)
export class AccountDocument extends BaseDocument {
  @Prop({ required: true, enum: IamNamespace })
  namespace: IamNamespace;

  @Prop({ default: false, required: true })
  blocked: boolean;

  @Prop({ required: true })
  identifier: string;

  @Prop({ required: true, enum: EIdentifierType })
  identifierType: EIdentifierType;

  @Prop({
    type: CredentialsDocument.schema,
  })
  credentials: CredentialsDocument;
}
