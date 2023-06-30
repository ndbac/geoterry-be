import { Prop, Schema } from '@nestjs/mongoose';
import { BaseDocument } from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';
import { LanguageCode } from 'src/shared/types';

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
}
