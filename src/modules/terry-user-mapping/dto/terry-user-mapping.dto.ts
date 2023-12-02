import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { BaseDbResponseDto } from 'src/shared/common-DTOs';

export class TerryUserMappingResDto extends BaseDbResponseDto {
  @ApiProperty({ type: String })
  terryId: string;

  @ApiProperty({ type: String })
  profileId: string;

  @ApiPropertyOptional({ type: Number })
  rate?: number;

  @ApiPropertyOptional({ type: Boolean })
  checkedIn?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  favourite?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  saved?: boolean;

  @ApiPropertyOptional({ type: String })
  path?: string;
}

export class UpsertTerryUserMappingInputDto {
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  favourite?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  saved?: boolean;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  path?: string;
}
