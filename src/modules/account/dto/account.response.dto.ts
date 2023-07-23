import { ApiProperty } from '@nestjs/swagger';
import { BaseDbResponseDto } from 'src/shared/common-DTOs';
import { EIdentifierType, IamNamespace } from 'src/shared/types';

export class AccountCredentialsResDto {
  @ApiProperty({ type: Date })
  passwordChangedAt: Date;

  @ApiProperty({ type: String })
  token: string;

  @ApiProperty({ type: String })
  refreshToken: string;
}

export class AccountResponseDto extends BaseDbResponseDto {
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
