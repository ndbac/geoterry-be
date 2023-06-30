import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsValidPhoneNumber } from 'src/decorators/is-valid-phone-number.decorator';
import { RequestContextDto } from 'src/shared/common-DTOs';
import { Currency, LanguageCode } from 'src/shared/types';
import { ICreateStoreData } from '../store.types';

export class CreateStoreReqDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  businessName: string;

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

  @ApiProperty({ type: String, enum: Currency })
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ type: String, enum: LanguageCode })
  @IsOptional()
  @IsEnum(LanguageCode)
  languageCode?: LanguageCode;
}

export class SellerCreateStoreInputWithUserContextDto extends RequestContextDto {
  @Type(() => CreateStoreReqDto)
  @ValidateNested()
  data: ICreateStoreData;
}
