import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Allow } from 'class-validator';
import { IIamUserData } from 'src/guards/types';
import { IStore } from 'src/modules/store/store.types';

export class BaseDbResponseDto {
  @ApiProperty()
  @Allow()
  id: string;

  @ApiProperty({ type: Date })
  @Type(() => Date)
  @Allow()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @Type(() => Date)
  @Allow()
  updatedAt: Date;
}

export class RequestContextDto {
  @Allow()
  store: IStore;

  @Allow()
  user: IIamUserData;
}
