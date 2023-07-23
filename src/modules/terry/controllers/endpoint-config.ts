import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import { TerryInputDto } from '../dto/terry.dto';
import { TerryResponseDto } from '../dto/terry-response.dto';
import { TerryFilterInputDto } from '../dto/terry-filter.dto';

export enum ETerryOperation {
  BUILDER_CREATE_TERRY = 'builderCreateTerry',
  BUILDER_GET_TERRIES = 'builderGetTerries',
}

export const TERRY_ENDPOINT_CONFIG: Record<
  ETerryOperation,
  IEndpointConfiguration
> = {
  [ETerryOperation.BUILDER_CREATE_TERRY]: {
    operationId: ETerryOperation.BUILDER_CREATE_TERRY,
    summary: 'Builder create terry',
    body: {
      type: TerryInputDto,
    },
    params: [
      {
        name: 'profileId',
      },
    ],
    responses: [
      {
        type: TerryResponseDto,
        status: HttpStatus.CREATED,
      },
    ],
  },
  [ETerryOperation.BUILDER_GET_TERRIES]: {
    operationId: ETerryOperation.BUILDER_GET_TERRIES,
    summary: 'Builder get terries',
    body: {
      type: TerryFilterInputDto,
    },
    params: [
      {
        name: 'profileId',
      },
    ],
    responses: [
      {
        type: [TerryResponseDto],
        status: HttpStatus.OK,
      },
    ],
  },
};
