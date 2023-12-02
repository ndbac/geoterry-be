import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { EMessageType } from '../types';

export class MessagePayloadDto {
  @ApiProperty({ enum: EMessageType })
  @IsNotEmpty()
  @IsEnum(EMessageType)
  type: EMessageType;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @ValidateIf((o: MessagePayloadDto) => o.type === EMessageType.TEXT)
  @IsNotEmpty()
  text?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @ValidateIf((o: MessagePayloadDto) => o.type === EMessageType.IMAGE)
  @IsNotEmpty()
  mediaUrl?: string;
}

export class SendMessageInputDto {
  @ApiProperty({ type: MessagePayloadDto })
  @Type(() => MessagePayloadDto)
  @ValidateNested()
  @IsNotEmpty()
  payload: MessagePayloadDto;

  @ApiPropertyOptional({
    type: String,
    description: 'To send to this conversation',
  })
  @IsString()
  @IsOptional()
  conversationId?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'To create and send to new conversation of this recipient',
  })
  @IsString()
  @IsOptional()
  recipientId?: string;
}
