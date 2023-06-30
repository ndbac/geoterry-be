import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import { UploadPhotoDto, UploadPhotoResponseDto } from '../dto/common.dto';
import { CreateStoreReqDto } from '../dto/create-store.dto';
import { StoreResDto } from '../dto/store-response.dto';
import { UpdateStoreReqDto } from '../dto/update-store.dto';

export enum EAccountOperation {
  SELLER_CREATE_STORE = 'sellerCreateStore',
  SELLER_UPDATE_STORE = 'sellerUpdateStore',
  SELLER_READ_STORE = 'sellerReadStore',
  SELLER_UPLOAD_PHOTO = 'sellerUploadPhoto',
  PUBLIC_READ_STORE = 'publicReadStore',
}

export const ACCOUNT_ENDPOINT_CONFIG: Record<
  EAccountOperation,
  IEndpointConfiguration
> = {
  [EAccountOperation.SELLER_CREATE_STORE]: {
    operationId: EAccountOperation.SELLER_CREATE_STORE,
    summary: 'Seller create store',
    body: {
      type: CreateStoreReqDto,
    },
    responses: [
      {
        type: StoreResDto,
        status: HttpStatus.CREATED,
      },
    ],
  },
  [EAccountOperation.SELLER_UPDATE_STORE]: {
    operationId: EAccountOperation.SELLER_UPDATE_STORE,
    summary: 'Seller update store',
    body: {
      type: UpdateStoreReqDto,
    },
    responses: [
      {
        type: StoreResDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [EAccountOperation.SELLER_READ_STORE]: {
    operationId: EAccountOperation.SELLER_READ_STORE,
    summary: 'Seller read store',
    responses: [
      {
        type: StoreResDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [EAccountOperation.SELLER_UPLOAD_PHOTO]: {
    operationId: EAccountOperation.SELLER_UPLOAD_PHOTO,
    summary: 'Seller upload photo and get url',
    body: {
      type: UploadPhotoDto,
    },
    responses: [
      {
        type: UploadPhotoResponseDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [EAccountOperation.PUBLIC_READ_STORE]: {
    operationId: EAccountOperation.PUBLIC_READ_STORE,
    summary: 'Public read store',
    responses: [
      {
        type: StoreResDto,
        status: HttpStatus.OK,
      },
    ],
  },
};
