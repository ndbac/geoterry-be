import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class GetConversationMessagesOptions {
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  markAllAsRead?: boolean;
}
