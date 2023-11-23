import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { BaseDbResponseDto } from 'src/shared/common-DTOs';

export class HunterLocationDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}

export class TerryCheckinInputDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  terryId: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  reviewText?: string;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  isFound: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsUrl(undefined, { each: true })
  photoUrls?: string[];

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rate?: number;

  @ApiProperty({ type: HunterLocationDto })
  @IsNotEmpty()
  @Type(() => HunterLocationDto)
  @ValidateNested()
  location: HunterLocationDto;
}

export class ProfileDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  displayName: string;

  @ApiPropertyOptional({ type: String })
  logoUrl?: string;
}

export class TerryMetadataResDto {
  @ApiPropertyOptional({ type: Number })
  size?: number;

  @ApiPropertyOptional({ type: Number })
  difficulty?: number;

  @ApiPropertyOptional({ type: Number })
  terrain?: number;
}

export class TerryLocationResDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}

export class TerryDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: TerryMetadataResDto })
  metadata?: TerryMetadataResDto;

  @ApiProperty({ type: TerryLocationResDto })
  location: TerryLocationResDto;
}

export class TerryCheckinResDto extends BaseDbResponseDto {
  @ApiProperty({ type: String })
  terryId: string;

  @ApiProperty({ type: String })
  profileId: string;

  @ApiPropertyOptional({ type: String })
  reviewText?: string;

  @ApiPropertyOptional({ type: [String] })
  photoUrls?: string[];

  @ApiPropertyOptional({ type: Number })
  rate?: number;

  @ApiProperty({ type: HunterLocationDto })
  location: HunterLocationDto;

  @ApiPropertyOptional({ type: ProfileDto })
  profile?: ProfileDto;

  @ApiPropertyOptional({ type: TerryDto })
  terry?: TerryDto;

  @ApiProperty({ type: Boolean })
  isFound: boolean;
}

export class UpdateTerryCheckinInputDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  reviewText?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsUrl(undefined, { each: true })
  photoUrls?: string[];

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rate?: number;
}
