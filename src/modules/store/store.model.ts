import { Prop, Schema } from '@nestjs/mongoose';
import { BaseDocument } from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';
import { Currency, LanguageCode } from 'src/shared/types';

@Schema(DefaultSchemaOptions)
export class StoreDocument extends BaseDocument {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  businessName: string;

  @Prop({ type: String })
  email?: string;

  @Prop({ type: String })
  phoneNumber?: string;

  @Prop({ type: String })
  address?: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ enum: Currency })
  currency: Currency;

  @Prop()
  logoUrl?: string;

  @Prop()
  qrCodeUrl?: string;

  @Prop({ default: LanguageCode.ENGLISH, enum: LanguageCode })
  languageCode: LanguageCode;
}
