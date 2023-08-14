import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { IsValidPhoneNumber } from 'src/decorators/is-valid-phone-number.decorator';
import { EIdentifierType, IamNamespace } from 'src/shared/types';

export class AccountLoginInputDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @ValidateIf(
    (val: AccountLoginInputDto) =>
      val.identifierType === EIdentifierType.PHONE_NUMBER,
  )
  @IsValidPhoneNumber()
  identifier: string;

  @ApiProperty({ type: String, enum: EIdentifierType })
  @IsNotEmpty()
  @IsEnum(EIdentifierType)
  identifierType: EIdentifierType;

  @ApiProperty({ type: String, enum: IamNamespace })
  @IsNotEmpty()
  @IsEnum(IamNamespace)
  namespace: IamNamespace;
}

export class AccountRefreshToken {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class AccountUpdateCredentialsDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;
}
