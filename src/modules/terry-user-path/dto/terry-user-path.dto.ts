import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseDbResponseDto } from 'src/shared/common-DTOs';

export class TerryUserPathInputDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  path?: string;
}

export class TerryUserPathResDto extends BaseDbResponseDto {
  @ApiProperty({ type: String })
  terryId: string;

  @ApiProperty({ type: String })
  profileId: string;

  @ApiPropertyOptional({ type: String })
  path?: string;
}
