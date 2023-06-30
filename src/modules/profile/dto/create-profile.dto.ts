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
import { LanguageCode } from 'src/shared/types';
import { ICreateProfileData } from '../profile.types';

export class CreateProfileReqDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  displayName: string;

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
  bio?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ type: String, enum: LanguageCode })
  @IsOptional()
  @IsEnum(LanguageCode)
  languageCode?: LanguageCode;
}

export class UserCreateProfileInputWithUserContextDto extends RequestContextDto {
  @Type(() => CreateProfileReqDto)
  @ValidateNested()
  data: ICreateProfileData;
}
