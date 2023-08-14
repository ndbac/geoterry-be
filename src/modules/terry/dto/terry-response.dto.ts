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
  @ApiPropertyOptional({ type: Number })
  size?: number;

  @ApiPropertyOptional({ type: Number })
  difficulty?: number;

  @ApiPropertyOptional({ type: Number })
  terrain?: number;
}

export class ProfileDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  displayName: string;

  @ApiPropertyOptional({ type: String })
  logoUrl?: string;
}

export class TerryResponseDto extends BaseDbResponseDto {
  @ApiProperty({ type: String })
  profileId: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  description?: string;

  @ApiProperty({ type: Boolean })
  isAvailable: boolean;

  @ApiPropertyOptional({ type: [String] })
  photoUrls?: string[];

  @ApiPropertyOptional({ type: [String] })
  categoryIds?: string[];

  @ApiProperty({ type: TerryLocationResDto })
  location: TerryLocationResDto;

  @ApiPropertyOptional({ type: TerryMetadataResDto })
  metadata?: TerryMetadataResDto;

  @ApiPropertyOptional({ type: ProfileDto })
  profile?: ProfileDto;

  @ApiPropertyOptional({ type: [TerryCategoryResDto] })
  categories?: TerryCategoryResDto[];

  @ApiPropertyOptional({ type: Number, description: 'Distance in meters' })
  distance?: number;
}
