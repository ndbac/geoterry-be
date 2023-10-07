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
  Min,
  Max,
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

export class TerryMetadataDto {
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

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  hint?: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsNotEmpty()
  isAvailable: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsUrl(undefined, { each: true })
  @IsOptional()
  photoUrls?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];

  @ApiProperty({ type: TerryLocationDto })
  @IsNotEmpty()
  @Type(() => TerryLocationDto)
  @ValidateNested()
  location: TerryLocationDto;

  @ApiPropertyOptional({ type: TerryMetadataDto })
  @IsOptional()
  @Type(() => TerryMetadataDto)
  @ValidateNested()
  metadata?: TerryMetadataDto;
}

export class TerryUpdateInputDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  hint?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsUrl(undefined, { each: true })
  @IsOptional()
  photoUrls?: string[];

  @ApiPropertyOptional({ type: TerryLocationDto })
  @IsOptional()
  @Type(() => TerryLocationDto)
  @ValidateNested()
  location?: TerryLocationDto;

  @ApiPropertyOptional({ type: TerryMetadataDto })
  @IsOptional()
  @Type(() => TerryMetadataDto)
  @ValidateNested()
  metadata?: TerryMetadataDto;
}
