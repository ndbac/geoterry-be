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
  BUILDER_GET_TERRY = 'builderGetTerry',
  HUNTER_GET_TERRIES = 'hunterGetTerries',
  HUNTER_GET_TERRY = 'hunterGetTerry',
  PUBLIC_GET_TERRIES = 'publicGetTerries',
  PUBLIC_GET_TERRY = 'publicGetTerry',
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
      {
        name: 'includeProfileData',
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
  [ETerryOperation.BUILDER_GET_TERRY]: {
    operationId: ETerryOperation.BUILDER_GET_TERRY,
    summary: 'Builder get terry',
    query: [
      {
        name: 'includeCategoryData',
        type: Boolean,
        required: false,
      },
      {
        name: 'includeProfileData',
        type: Boolean,
        required: false,
      },
    ],
    responses: [
      {
        type: TerryResponseDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [ETerryOperation.HUNTER_GET_TERRIES]: {
    operationId: ETerryOperation.HUNTER_GET_TERRIES,
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
      {
        name: 'includeProfileData',
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
  [ETerryOperation.HUNTER_GET_TERRY]: {
    operationId: ETerryOperation.HUNTER_GET_TERRY,
    summary: 'Builder get terry',
    query: [
      {
        name: 'includeCategoryData',
        type: Boolean,
        required: false,
      },
      {
        name: 'includeProfileData',
        type: Boolean,
        required: false,
      },
      {
        name: 'latitude',
        type: Number,
        required: false,
      },
      {
        name: 'longitude',
        type: Number,
        required: false,
      },
      {
        name: 'markAsSaved',
        type: Boolean,
        required: false,
      },
      {
        name: 'markAsFavourited',
        type: Boolean,
        required: false,
      },
    ],
    params: [
      {
        name: 'profileId',
        type: String,
        required: true,
      },
    ],
    responses: [
      {
        type: TerryResponseDto,
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
      {
        name: 'includeProfileData',
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
  [ETerryOperation.PUBLIC_GET_TERRY]: {
    operationId: ETerryOperation.PUBLIC_GET_TERRY,
    summary: 'Public get terry',
    query: [
      {
        name: 'includeCategoryData',
        type: Boolean,
        required: false,
      },
      {
        name: 'includeProfileData',
        type: Boolean,
        required: false,
      },
      {
        name: 'latitude',
        type: Number,
        required: false,
      },
      {
        name: 'longitude',
        type: Number,
        required: false,
      },
    ],
    responses: [
      {
        type: TerryResponseDto,
        status: HttpStatus.OK,
      },
    ],
  },
};
