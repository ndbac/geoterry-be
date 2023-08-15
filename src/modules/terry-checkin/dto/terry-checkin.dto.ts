import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
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
}
