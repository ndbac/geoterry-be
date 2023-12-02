import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import {
  TerryUserPathInputDto,
  TerryUserPathResDto,
} from '../dto/terry-user-path.dto';

export enum ETerryUserPathOperation {
  HUNTER_UPSERT_TERRY_USER_PATH = 'hunterUpsertTerryUserPath',
  HUNTER_GET_TERRY_USER_PATH = 'hunterGetTerryUserPath',
}

export const TERRY_USER_PATH_ENDPOINT_CONFIG: Record<
  ETerryUserPathOperation,
  IEndpointConfiguration
> = {
  [ETerryUserPathOperation.HUNTER_UPSERT_TERRY_USER_PATH]: {
    operationId: ETerryUserPathOperation.HUNTER_UPSERT_TERRY_USER_PATH,
    summary: 'Hunter upsert terry user path',
    body: {
      type: TerryUserPathInputDto,
    },
    responses: [
      {
        type: TerryUserPathResDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [ETerryUserPathOperation.HUNTER_GET_TERRY_USER_PATH]: {
    operationId: ETerryUserPathOperation.HUNTER_GET_TERRY_USER_PATH,
    summary: 'Hunter get terry user path',
    responses: [
      {
        type: TerryUserPathResDto,
        status: HttpStatus.OK,
      },
    ],
    deprecated: true,
  },
};
