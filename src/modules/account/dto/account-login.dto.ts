import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { IsValidPhoneNumber } from 'src/decorators/is-valid-phone-number.decorator';
import { EIdentifierType } from 'src/shared/types';

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
}

export class AccountRefreshToken {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  token: string;
}
