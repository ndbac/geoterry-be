import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import {
  FilterTerryCategoryInputDto,
  TerryCategoryInputDto,
  TerryCategoryResDto,
  UpdateTerryCategoryInputDto,
} from '../dto/terry-category.dto';

export enum ETerryCategoryOperation {
  ADMIN_CREATE_TERRY_CATEGORY = 'adminCreateTerryCategory',
  ADMIN_UPDATE_TERRY_CATEGORY = 'adminUpdateTerryCategory',
  ADMIN_DELETE_TERRY_CATEGORY = 'adminDeleteTerryCategory',
  ADMIN_READ_TERRY_CATEGORY = 'adminReadTerryCategory',
  ADMIN_FILTER_TERRY_CATEGORY = 'adminFilterTerryCategories',
  PUBLIC_FILTER_TERRY_CATEGORY = 'publicFilterTerryCategories',
}

export const TERRY_CATEGORY_ENDPOINT_CONFIG: Record<
  ETerryCategoryOperation,
  IEndpointConfiguration
> = {
  [ETerryCategoryOperation.ADMIN_CREATE_TERRY_CATEGORY]: {
    operationId: ETerryCategoryOperation.ADMIN_CREATE_TERRY_CATEGORY,
    summary: 'Admin create terry category',
    body: {
      type: TerryCategoryInputDto,
    },
    responses: [
      {
        type: TerryCategoryResDto,
        status: HttpStatus.CREATED,
      },
    ],
  },
  [ETerryCategoryOperation.ADMIN_UPDATE_TERRY_CATEGORY]: {
    operationId: ETerryCategoryOperation.ADMIN_UPDATE_TERRY_CATEGORY,
    summary: 'Admin update terry category',
    body: {
      type: UpdateTerryCategoryInputDto,
    },
    responses: [
      {
        type: TerryCategoryResDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [ETerryCategoryOperation.ADMIN_DELETE_TERRY_CATEGORY]: {
    operationId: ETerryCategoryOperation.ADMIN_DELETE_TERRY_CATEGORY,
    summary: 'Admin delete terry category by id',
    responses: [
      {
        status: HttpStatus.OK,
      },
    ],
  },
  [ETerryCategoryOperation.ADMIN_READ_TERRY_CATEGORY]: {
    operationId: ETerryCategoryOperation.ADMIN_READ_TERRY_CATEGORY,
    summary: 'Admin read terry category by id',
    responses: [
      {
        type: TerryCategoryResDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [ETerryCategoryOperation.ADMIN_FILTER_TERRY_CATEGORY]: {
    operationId: ETerryCategoryOperation.ADMIN_FILTER_TERRY_CATEGORY,
    summary: 'Admin filter terry categories',
    body: {
      type: FilterTerryCategoryInputDto,
    },
    responses: [
      {
        type: [TerryCategoryResDto],
        status: HttpStatus.OK,
      },
    ],
  },
  [ETerryCategoryOperation.PUBLIC_FILTER_TERRY_CATEGORY]: {
    operationId: ETerryCategoryOperation.PUBLIC_FILTER_TERRY_CATEGORY,
    summary: 'Public filter terry categories',
    body: {
      type: FilterTerryCategoryInputDto,
    },
    responses: [
      {
        type: [TerryCategoryResDto],
        status: HttpStatus.OK,
      },
    ],
  },
};
