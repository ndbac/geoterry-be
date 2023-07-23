import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
  @ApiProperty({ type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsNotEmpty()
  location: LocationDto;

  @ApiProperty({ type: DistanceQueryDto })
  @ValidateNested()
  @Type(() => DistanceQueryDto)
  @IsOptional()
  distance?: DistanceQueryDto;
}
