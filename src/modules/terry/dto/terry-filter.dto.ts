import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
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
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  textSearch?: string;

  @ApiProperty({ type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @ApiProperty({ type: DistanceQueryDto })
  @ValidateNested()
  @Type(() => DistanceQueryDto)
  @IsOptional()
  distance?: DistanceQueryDto;
}
