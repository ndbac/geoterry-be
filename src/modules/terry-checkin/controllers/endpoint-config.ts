import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import {
  TerryCheckinInputDto,
  TerryCheckinResDto,
  UpdateTerryCheckinInputDto,
} from '../dto/terry-checkin.dto';
import { FilterTerryCheckinDto } from '../dto/terry-filter.dto';

export enum ETerryCheckinOperation {
  HUNTER_CHECKIN_TERRY = 'hunterCheckinTerry',
  HUNTER_UPDATE_TERRY_CHECKIN = 'hunterUpdateTerryCheckin',
  HUNTER_GET_TERRY_CHECKIN = 'hunterGetTerryCheckin',
  HUNTER_DELETE_TERRY_CHECKIN = 'hunterDeleteTerryCheckin',
  HUNTER_FILTER_TERRY_CHECKINS = 'hunterFilterTerryCheckins',
  PUBLIC_GET_CHECKINS_OF_TERRY = 'publicGetCheckinsOfTerry',
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
  [ETerryCheckinOperation.HUNTER_UPDATE_TERRY_CHECKIN]: {
    operationId: ETerryCheckinOperation.HUNTER_UPDATE_TERRY_CHECKIN,
    summary: 'Hunter update terry checkin',
    body: {
      type: UpdateTerryCheckinInputDto,
    },
    responses: [
      {
        type: TerryCheckinResDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [ETerryCheckinOperation.HUNTER_GET_TERRY_CHECKIN]: {
    operationId: ETerryCheckinOperation.HUNTER_GET_TERRY_CHECKIN,
    summary: 'Hunter get terry checkin',
    responses: [
      {
        type: TerryCheckinResDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [ETerryCheckinOperation.HUNTER_DELETE_TERRY_CHECKIN]: {
    operationId: ETerryCheckinOperation.HUNTER_DELETE_TERRY_CHECKIN,
    summary: 'Hunter delete terry checkin',
    responses: [
      {
        status: HttpStatus.OK,
      },
    ],
  },
  [ETerryCheckinOperation.HUNTER_FILTER_TERRY_CHECKINS]: {
    operationId: ETerryCheckinOperation.HUNTER_FILTER_TERRY_CHECKINS,
    summary: 'Hunter filter terry checkins',
    body: {
      type: FilterTerryCheckinDto,
    },
    responses: [
      {
        type: [TerryCheckinResDto],
        status: HttpStatus.OK,
      },
    ],
  },
  [ETerryCheckinOperation.PUBLIC_GET_CHECKINS_OF_TERRY]: {
    operationId: ETerryCheckinOperation.PUBLIC_GET_CHECKINS_OF_TERRY,
    summary: 'Public get checkins of terry',
    responses: [
      {
        type: [TerryCheckinResDto],
        status: HttpStatus.OK,
      },
    ],
  },
};
