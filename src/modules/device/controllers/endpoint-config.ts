import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import { CreateOrUpdateDeviceInputDto, DeviceResDto } from '../dto/device.dto';

export enum EDeviceOperation {
  USER_CREATE_OR_UPDATE_DEVICE = 'userCreateOrUpdateDevice',
  USER_DELETE_DEVICE = 'userDeleteDevice',
}

export const DEVICE_ENDPOINT_CONFIG: Record<
  EDeviceOperation,
  IEndpointConfiguration
> = {
  [EDeviceOperation.USER_CREATE_OR_UPDATE_DEVICE]: {
    operationId: EDeviceOperation.USER_CREATE_OR_UPDATE_DEVICE,
    summary: 'User create or update device',
    body: {
      type: CreateOrUpdateDeviceInputDto,
    },
    responses: [
      {
        type: DeviceResDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [EDeviceOperation.USER_DELETE_DEVICE]: {
    operationId: EDeviceOperation.USER_DELETE_DEVICE,
    summary: 'User delete device',
    responses: [
      {
        status: HttpStatus.OK,
      },
    ],
  },
};
