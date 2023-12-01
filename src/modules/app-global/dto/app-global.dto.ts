import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EAppGlobalType, EFeatureRolloutMode } from '../types';

export class AppGlobalBaseResponseDto {
  @ApiProperty()
  type: EAppGlobalType;
}

export class VersionConfigurationResponseDto {
  @ApiProperty()
  minimumSupportedVersion: string;

  @ApiProperty()
  latestAppVersion: string;
}

export class AppGlobalConfigurationResponseDto extends AppGlobalBaseResponseDto {
  @ApiProperty({ type: VersionConfigurationResponseDto })
  ios: VersionConfigurationResponseDto;

  @ApiProperty({ type: VersionConfigurationResponseDto })
  android: VersionConfigurationResponseDto;
}

export class FeatureFlagsModeDto {
  @ApiPropertyOptional({ enum: EFeatureRolloutMode })
  rolloutMode: EFeatureRolloutMode;
}

export class AppGlobalFeatureFlagsResponseDto extends AppGlobalBaseResponseDto {
  @ApiProperty({
    type: Map,
    description: 'show feature status',
    example: {
      chat: true,
    },
  })
  featureFlags: Map<string, FeatureFlagsModeDto>;
}
