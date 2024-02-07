import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageResDto } from 'src/modules/messages/dto/message.dto';
import { BaseDbResponseDto } from 'src/shared/common-DTOs';

export class ConversationLastMsgResDto {
  @ApiProperty({ type: String })
  snippet: string;

  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  sentAt: Date;

  @ApiProperty({ type: String })
  sentByProfileId: string;
}

export class ParticipantResDto {
  @ApiProperty({ type: String })
  profileId: string;

  @ApiProperty({ type: Number })
  unreadMsgCnt: number;

  @ApiPropertyOptional({ type: String })
  displayName?: string;

  @ApiPropertyOptional({ type: String })
  logoUrl?: string;
}

export class ConversationResDto extends BaseDbResponseDto {
  @ApiProperty({ type: ConversationLastMsgResDto })
  lastMsg: ConversationLastMsgResDto;

  @ApiProperty({ type: [ParticipantResDto] })
  participants: ParticipantResDto[];

  @ApiProperty({ type: Number })
  msgCount: number;

  @ApiPropertyOptional({ type: [MessageResDto] })
  messages?: MessageResDto[];
}

export class ConversationStatResDto {
  @ApiProperty({ type: Number })
  totalConversationCnt: number;

  @ApiProperty({ type: Number })
  unreadConversationCnt: number;
}
