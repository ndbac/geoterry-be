import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class NotificationMetadataDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  body?: string;

  @ApiPropertyOptional({ type: String })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}

export class NotificationInputDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  profileId: string;

  @ApiProperty({ type: NotificationMetadataDto })
  @Type(() => NotificationMetadataDto)
  @ValidateNested()
  @IsNotEmpty()
  metadata: NotificationMetadataDto;
}
