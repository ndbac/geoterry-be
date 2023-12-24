import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { TerryCategoryResDto } from 'src/modules/terry-category/dto/terry-category.dto';
import { BaseDbResponseDto } from 'src/shared/common-DTOs';

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

export class TerryMetadataResDto {
  @ApiProperty({ type: Number })
  size: number;

  @ApiProperty({ type: Number })
  difficulty: number;

  @ApiProperty({ type: Number })
  terrain: number;
}

export class ProfileResDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  displayName: string;

  @ApiPropertyOptional({ type: String })
  logoUrl?: string;
}

export class RatingResDto {
  @ApiProperty({ type: Number })
  rate: number;

  @ApiProperty({ type: Number })
  total: number;
}

export class TerryResponseDto extends BaseDbResponseDto {
  @ApiProperty({ type: String })
  profileId: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  description?: string;

  @ApiPropertyOptional({ type: String })
  address?: string;

  @ApiPropertyOptional({ type: String })
  hint?: string;

  @ApiProperty({ type: Boolean })
  isAvailable: boolean;

  @ApiPropertyOptional({ type: [String] })
  photoUrls?: string[];

  @ApiPropertyOptional({ type: [String] })
  categoryIds?: string[];

  @ApiProperty({ type: TerryLocationResDto })
  location: TerryLocationResDto;

  @ApiProperty({ type: TerryMetadataResDto })
  metadata: TerryMetadataResDto;

  @ApiPropertyOptional({ type: ProfileResDto })
  profile?: ProfileResDto;

  @ApiPropertyOptional({ type: [TerryCategoryResDto] })
  categories?: TerryCategoryResDto[];

  @ApiPropertyOptional({ type: Number, description: 'Distance in meters' })
  distance?: number;

  @ApiProperty({ type: RatingResDto })
  rating: RatingResDto;

  @ApiPropertyOptional({ type: Boolean })
  favourite?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  saved?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  checkedIn?: boolean;

  @ApiPropertyOptional({ type: String })
  path?: string;
}
