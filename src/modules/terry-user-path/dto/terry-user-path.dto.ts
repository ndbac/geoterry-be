import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { BaseDbResponseDto } from 'src/shared/common-DTOs';

export class CoordinateInputDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}

export class TerryUserPathInputDto {
  @ApiPropertyOptional({ type: [CoordinateInputDto] })
  @Type(() => CoordinateInputDto)
  @ValidateNested()
  @IsOptional()
  coordinates?: CoordinateResDto[];
}

export class CoordinateResDto {
  @ApiProperty({ type: Number })
  latitude: number;

  @ApiProperty({ type: Number })
  longitude: number;
}

export class TerryUserPathResDto extends BaseDbResponseDto {
  @ApiProperty({ type: String })
  terryId: string;

  @ApiProperty({ type: String })
  profileId: string;

  @ApiPropertyOptional({ type: [CoordinateResDto] })
  coordinates?: CoordinateResDto[];
}
