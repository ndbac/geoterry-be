import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import {
  TerryCheckinInputDto,
  TerryCheckinResDto,
} from '../dto/terry-checkin.dto';

export enum ETerryCheckinOperation {
  HUNTER_CHECKIN_TERRY = 'hunterCheckinTerry',
}

export const TERRY_CHECKIN_ENDPOINT_CONFIG: Record<
  ETerryCheckinOperation,
  IEndpointConfiguration
> = {
  [ETerryCheckinOperation.HUNTER_CHECKIN_TERRY]: {
    operationId: ETerryCheckinOperation.HUNTER_CHECKIN_TERRY,
    summary: 'Hunter checkin terry',
    body: {
      type: TerryCheckinInputDto,
    },
    responses: [
      {
        type: TerryCheckinResDto,
        status: HttpStatus.CREATED,
      },
    ],
  },
};
