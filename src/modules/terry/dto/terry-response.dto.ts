import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
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

  @ApiProperty({ type: TerryLocationResDto })
  location: TerryLocationResDto;

  @ApiPropertyOptional({ type: Number, description: 'Distance in meters' })
  distance?: number;
}
