import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDbResponseDto } from 'src/shared/common-DTOs';

export class NotificationMetadataResDto {
  @ApiPropertyOptional({ type: String })
  title?: string;

  @ApiPropertyOptional({ type: String })
  body?: string;

  @ApiPropertyOptional({ type: String })
  imageUrl?: string;
}

export class NotificationHistoryResDto extends BaseDbResponseDto {
  @ApiProperty({ type: String })
  profileId: string;

  @ApiProperty({ type: Date })
  sentAt: Date;

  @ApiProperty({ type: NotificationMetadataResDto })
  metadata: NotificationMetadataResDto;
}
