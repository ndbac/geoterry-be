import { ApiProperty } from '@nestjs/swagger';
import { EIdentifierType, IamNamespace } from 'src/shared/types';

export class AccountCredentialsResDto {
  @ApiProperty({ type: Date })
  passwordChangedAt: Date;
}

export class AccountResponseDto {
  @ApiProperty({ type: String, enum: IamNamespace })
  namespace: IamNamespace;

  @ApiProperty({ type: Boolean })
  blocked: boolean;

  @ApiProperty({ type: String })
  identifier: string;

  @ApiProperty({ type: String, enum: EIdentifierType })
  identifierType: EIdentifierType;

  @ApiProperty()
  credentials: AccountCredentialsResDto;
}

export class AccountTokenDataDto {
  @ApiProperty({ type: Date })
  expiresIn: Date;

  @ApiProperty({ type: String })
  accessToken: string;
}

export class AccountLoginResDto extends AccountResponseDto {
  @ApiProperty({ type: AccountTokenDataDto })
  token: AccountTokenDataDto;
}
