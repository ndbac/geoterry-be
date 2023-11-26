import { ApiProperty } from '@nestjs/swagger';
import { BaseDbResponseDto } from 'src/shared/common-DTOs';

export class ConversationLastMsgResDto extends BaseDbResponseDto {
  @ApiProperty({ type: String })
  snippet: string;

  @ApiProperty({ type: Date })
  sentAt: Date;

  @ApiProperty({ type: String })
  sentByProfileId: string;
}

export class ConversationResDto extends BaseDbResponseDto {
  @ApiProperty({ type: ConversationLastMsgResDto })
  lastMsg: ConversationLastMsgResDto;

  @ApiProperty({ type: [String] })
  participants: string[];

  @ApiProperty({ type: String })
  profileId: string;

  @ApiProperty({ type: Number })
  unreadMsgCnt: number;

  @ApiProperty({ type: Number })
  msgCount: number;
}
