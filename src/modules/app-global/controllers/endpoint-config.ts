import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import {
  AppGlobalConfigurationResponseDto,
  AppGlobalFeatureFlagsResponseDto,
} from '../dto/app-global.dto';

export enum EAppGlobalOperationId {
  GET_FEATURE_FLAGS = 'getFeatureFlags',
  GET_VERSION_CONFIGURATION = 'getVersionConfiguration',
}

export const APP_GLOBAL_ENDPOINT_CONFIG: Record<
  EAppGlobalOperationId,
  IEndpointConfiguration
> = {
  [EAppGlobalOperationId.GET_VERSION_CONFIGURATION]: {
    operationId: EAppGlobalOperationId.GET_VERSION_CONFIGURATION,
    summary: 'To get version configuration',
    responses: [
      {
        status: HttpStatus.OK,
        type: AppGlobalConfigurationResponseDto,
      },
    ],
  },
  [EAppGlobalOperationId.GET_FEATURE_FLAGS]: {
    operationId: EAppGlobalOperationId.GET_FEATURE_FLAGS,
    summary: 'To get feature flags',
    responses: [
      {
        status: HttpStatus.OK,
        type: AppGlobalFeatureFlagsResponseDto,
      },
    ],
  },
};
