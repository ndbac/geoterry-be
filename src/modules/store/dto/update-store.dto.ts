import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsValidPhoneNumber } from 'src/decorators/is-valid-phone-number.decorator';
import { Currency, LanguageCode } from 'src/shared/types';

export class UpdateStoreReqDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsValidPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ type: String, enum: Currency })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/, {
    message: 'Slug should be not contained any special characters',
  })
  @MinLength(6)
  @MaxLength(32)
  slug?: string;

  @ApiPropertyOptional({ type: String, enum: LanguageCode })
  @IsOptional()
  @IsEnum(LanguageCode)
  languageCode?: LanguageCode;
}
