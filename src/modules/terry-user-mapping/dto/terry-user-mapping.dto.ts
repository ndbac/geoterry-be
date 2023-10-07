import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';
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
}

export class UpsertTerryUserMappingInputDto {
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rate?: number;

  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  checkedIn?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  favourite?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  saved?: boolean;
}
