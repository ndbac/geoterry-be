import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import {
  TerryUserMappingResDto,
  UpsertTerryUserMappingInputDto,
} from '../dto/terry-user-mapping.dto';

export enum ETerryUserMappingOperation {
  HUNTER_UPSERT_TERRY_USER_MAPPING = 'hunterUpsertTerryUserMapping',
}

export const TERRY_USER_MAPPING_ENDPOINT_CONFIG: Record<
  ETerryUserMappingOperation,
  IEndpointConfiguration
> = {
  [ETerryUserMappingOperation.HUNTER_UPSERT_TERRY_USER_MAPPING]: {
    operationId: ETerryUserMappingOperation.HUNTER_UPSERT_TERRY_USER_MAPPING,
    summary: 'Hunter upsert terry user mapping',
    body: {
      type: UpsertTerryUserMappingInputDto,
    },
    responses: [
      {
        type: TerryUserMappingResDto,
        status: HttpStatus.OK,
      },
    ],
  },
};
