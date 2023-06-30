import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Allow } from 'class-validator';
import { IIamUserData } from 'src/guards/types';
import { IProfile } from 'src/modules/profile/profile.types';

export class BaseDbResponseDto {
  @ApiProperty()
  @Allow()
  id: string;

  @ApiProperty({ type: Date })
  @Type(() => Date)
  @Allow()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @Type(() => Date)
  @Allow()
  updatedAt: Date;
}

export class RequestContextDto {
  @Allow()
  profile: IProfile;

  @Allow()
  user: IIamUserData;
}
