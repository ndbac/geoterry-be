import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { BaseDbResponseDto } from 'src/shared/common-DTOs';

export class DeviceResDto extends BaseDbResponseDto {
  @ApiProperty()
  profileId: string;

  @ApiProperty()
  fcmToken: string;

  @ApiProperty()
  enabled: boolean;
}

export class CreateOrUpdateDeviceInputDto {
  @IsString()
  @ApiProperty()
  fcmToken: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  enabled?: boolean;
}
