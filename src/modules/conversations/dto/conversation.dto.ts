import { ApiProperty } from '@nestjs/swagger';
import { BaseDbResponseDto } from 'src/shared/common-DTOs';

export class ConversationLastMsgResDto {
  @ApiProperty({ type: String })
  snippet: string;

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
}

export class ConversationResDto extends BaseDbResponseDto {
  @ApiProperty({ type: ConversationLastMsgResDto })
  lastMsg: ConversationLastMsgResDto;

  @ApiProperty({ type: [ParticipantResDto] })
  participants: ParticipantResDto[];

  @ApiProperty({ type: String })
  profileId: string;

  @ApiProperty({ type: Number })
  unreadMsgCnt: number;

  @ApiProperty({ type: Number })
  msgCount: number;
}
