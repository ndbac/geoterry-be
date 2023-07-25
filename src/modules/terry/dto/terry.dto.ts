import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsUrl,
  IsNumber,
  ValidateNested,
} from 'class-validator';

export class TerryLocationDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}

export class TerryInputDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsNotEmpty()
  isAvailable: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsUrl(undefined, { each: true })
  @IsOptional()
  photoUrls?: string[];

  @ApiProperty({ type: TerryLocationDto })
  @IsNotEmpty()
  @Type(() => TerryLocationDto)
  @ValidateNested()
  location: TerryLocationDto;
}

export class TerryUpdateLocationDto {
  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}

export class TerryUpdateInputDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsUrl(undefined, { each: true })
  @IsOptional()
  photoUrls?: string[];

  @ApiPropertyOptional({ type: TerryUpdateLocationDto })
  @IsOptional()
  @Type(() => TerryUpdateLocationDto)
  @ValidateNested()
  location?: TerryUpdateLocationDto;
}
