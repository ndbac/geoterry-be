import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ERoleRequestStatus } from 'src/modules/account/types';
import { BaseDbResponseDto } from 'src/shared/common-DTOs';
import { IAccountRole, LanguageCode } from 'src/shared/types';

export class ProfileLastLocationResDto {
  @ApiProperty({ type: Number })
  latitude: number;

  @ApiProperty({ type: Number })
  longitude: number;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export class ProfileResDto extends BaseDbResponseDto {
  @ApiProperty({ type: String })
  displayName: string;

  @ApiPropertyOptional({ type: String })
  bio?: string;

  @ApiPropertyOptional({ type: String })
  email?: string;

  @ApiPropertyOptional({ type: String })
  phoneNumber?: string;

  @ApiProperty({ type: String })
  slug: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiPropertyOptional({ type: String })
  logoUrl?: string;

  @ApiPropertyOptional({ type: String, enum: LanguageCode })
  languageCode: LanguageCode;

  @ApiPropertyOptional({ type: Number })
  rewardPoints: number;

  @ApiPropertyOptional({ type: Number })
  totalCheckedinTerry: number;

  @ApiProperty({ enum: IAccountRole })
  role: IAccountRole;

  @ApiPropertyOptional({ enum: ERoleRequestStatus })
  roleRequestingStatus?: ERoleRequestStatus;

  @ApiPropertyOptional({ enum: IAccountRole })
  roleRequesting?: IAccountRole;

  @ApiPropertyOptional({ type: ProfileLastLocationResDto })
  lastLocation?: ProfileLastLocationResDto;
}

export class UserGetProfileNearbyResDto {
  @ApiProperty({ type: Number })
  profileId: number;
}
