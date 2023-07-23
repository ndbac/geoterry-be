import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDbResponseDto } from 'src/shared/common-DTOs';
import { MongoLocationType } from 'src/shared/mongoose/types';

export class TerryLocationResDto {
  @ApiProperty({ type: String, enum: MongoLocationType })
  type: MongoLocationType;

  @ApiProperty({
    type: [Number],
    example: [105.8397664, 21.0186282],
    description: 'longitude first, latitude second',
  })
  coordinates: number[];
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
}
