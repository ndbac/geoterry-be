import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class LocationDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  latitude: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  longitude: number;
}

export class DistanceQueryDto {
  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  max?: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  min?: number;
}

export class TerryFilterInputDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  textSearch?: string;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  size?: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  difficulty?: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  terrain?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];

  @ApiPropertyOptional({ type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @ApiPropertyOptional({ type: DistanceQueryDto })
  @ValidateNested()
  @Type(() => DistanceQueryDto)
  @IsOptional()
  distance?: DistanceQueryDto;
}
