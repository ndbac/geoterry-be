import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { IsValidPhoneNumber } from 'src/decorators/is-valid-phone-number.decorator';
import { EIdentifierType, IamNamespace } from 'src/shared/types';

export class RecoverAccountDto {
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
    (val: RecoverAccountDto) =>
      val.identifierType === EIdentifierType.PHONE_NUMBER,
  )
  @IsValidPhoneNumber()
  identifier: string;

  @ApiProperty({ type: String, enum: EIdentifierType })
  @IsNotEmpty()
  @IsEnum(EIdentifierType)
  identifierType: EIdentifierType;
}

export class VerifyAccountRecoverOTPDto extends OmitType(RecoverAccountDto, [
  'password',
  'code',
]) {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class VerifyAccountRecoverOTPResDto {
  @ApiProperty({ type: String })
  code: string;
}
