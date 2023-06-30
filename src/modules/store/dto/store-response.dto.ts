import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Currency, LanguageCode } from 'src/shared/types';

export class StoreResDto {
  @ApiProperty({ type: String })
  businessName: string;

  @ApiPropertyOptional({ type: String })
  email?: string;

  @ApiPropertyOptional({ type: String })
  phoneNumber?: string;

  @ApiPropertyOptional({ type: String })
  address?: string;

  @ApiProperty({ type: String })
  slug: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String, enum: Currency })
  currency: Currency;

  @ApiPropertyOptional({ type: String })
  logoUrl?: string;

  @ApiPropertyOptional({ type: String })
  qrCodeUrl?: string;

  @ApiPropertyOptional({ type: String, enum: LanguageCode })
  languageCode: LanguageCode;
}
