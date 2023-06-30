import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { IsValidPhoneNumber } from 'src/decorators/is-valid-phone-number.decorator';
import { EIdentifierType, IamNamespace } from 'src/shared/types';

export class CreateAccountDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ type: String, enum: IamNamespace })
  @IsNotEmpty()
  @IsEnum(IamNamespace)
  namespace: IamNamespace;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @ValidateIf(
    (val: CreateAccountDto) =>
      val.identifierType === EIdentifierType.PHONE_NUMBER,
  )
  @IsValidPhoneNumber()
  identifier: string;

  @ApiProperty({ type: String, enum: EIdentifierType })
  @IsNotEmpty()
  @IsEnum(EIdentifierType)
  identifierType: EIdentifierType;
}

export class SendVerificationDto {
  @ApiProperty({ type: String, enum: EIdentifierType })
  @IsNotEmpty()
  @IsEnum(EIdentifierType)
  identifierType: EIdentifierType;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @ValidateIf(
    (val: CreateAccountDto) =>
      val.identifierType === EIdentifierType.PHONE_NUMBER,
  )
  @IsValidPhoneNumber()
  identifier: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  isRecoverPassword?: boolean;
}
