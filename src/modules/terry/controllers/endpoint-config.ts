import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import { TerryInputDto, TerryUpdateInputDto } from '../dto/terry.dto';
import { TerryResponseDto } from '../dto/terry-response.dto';
import { TerryFilterInputDto } from '../dto/terry-filter.dto';

export enum ETerryOperation {
  BUILDER_CREATE_TERRY = 'builderCreateTerry',
  BUILDER_UPDATE_TERRY = 'builderUpdateTerry',
  BUILDER_DELETE_TERRY = 'builderDeleteTerry',
  BUILDER_GET_TERRIES = 'builderGetTerries',
  PUBLIC_GET_TERRIES = 'publicGetTerries',
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
  [ETerryOperation.BUILDER_UPDATE_TERRY]: {
    operationId: ETerryOperation.BUILDER_UPDATE_TERRY,
    summary: 'Builder update terry',
    body: {
      type: TerryUpdateInputDto,
    },
    params: [
      {
        name: 'terryId',
      },
    ],
    responses: [
      {
        type: TerryResponseDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [ETerryOperation.BUILDER_DELETE_TERRY]: {
    operationId: ETerryOperation.BUILDER_DELETE_TERRY,
    summary: 'Builder delete terry',
    params: [
      {
        name: 'terryId',
      },
    ],
    responses: [
      {
        status: HttpStatus.OK,
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
    query: [
      {
        name: 'includeCategoryData',
        type: Boolean,
        required: false,
      },
    ],
    responses: [
      {
        type: [TerryResponseDto],
        status: HttpStatus.OK,
      },
    ],
  },
  [ETerryOperation.PUBLIC_GET_TERRIES]: {
    operationId: ETerryOperation.PUBLIC_GET_TERRIES,
    summary: 'Public get terries',
    body: {
      type: TerryFilterInputDto,
    },
    query: [
      {
        name: 'includeCategoryData',
        type: Boolean,
        required: false,
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
