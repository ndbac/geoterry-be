import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDbResponseDto } from 'src/shared/common-DTOs';
import { EMessageType } from '../types';

export class MessagePayloadResDto extends BaseDbResponseDto {
  @ApiProperty({ enum: EMessageType })
  type: EMessageType;

  @ApiPropertyOptional({ type: String })
  text?: string;

  @ApiPropertyOptional({ type: String })
  mediaUrl?: string;
}

export class MessageResDto extends BaseDbResponseDto {
  @ApiProperty({ type: MessagePayloadResDto })
  payload: MessagePayloadResDto;

  @ApiProperty({ type: String })
  senderId: string;

  @ApiProperty({ type: String })
  recipientId: string;

  @ApiProperty({ type: String })
  conversationId: string;

  @ApiProperty({ type: Date })
  sentAt: Date;
}
