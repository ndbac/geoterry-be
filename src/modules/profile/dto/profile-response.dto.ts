import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LanguageCode } from 'src/shared/types';

export class ProfileResDto {
  @ApiProperty({ type: String })
  displayName: string;

  @ApiPropertyOptional({ type: String })
  bio?: string;

  @ApiPropertyOptional({ type: String })
  email?: string;

  @ApiPropertyOptional({ type: String })
  phoneNumber?: string;

  @ApiProperty({ type: String })
  slug: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiPropertyOptional({ type: String })
  logoUrl?: string;

  @ApiPropertyOptional({ type: String, enum: LanguageCode })
  languageCode: LanguageCode;
}
