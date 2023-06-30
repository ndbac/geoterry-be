import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import { UploadPhotoDto, UploadPhotoResponseDto } from '../dto/common.dto';
import { CreateProfileReqDto } from '../dto/create-profile.dto';
import { ProfileResDto } from '../dto/profile-response.dto';
import { UpdateProfileReqDto } from '../dto/update-profile.dto';

export enum EAccountOperation {
  USER_CREATE_PROFILE = 'userCreateProfile',
  USER_UPDATE_PROFILE = 'userUpdateProfile',
  USER_READ_PROFILE = 'userReadProfile',
  USER_UPLOAD_PHOTO = 'userUploadPhoto',
  PUBLIC_READ_PROFILE = 'publicReadProfile',
}

export const ACCOUNT_ENDPOINT_CONFIG: Record<
  EAccountOperation,
  IEndpointConfiguration
> = {
  [EAccountOperation.USER_CREATE_PROFILE]: {
    operationId: EAccountOperation.USER_CREATE_PROFILE,
    summary: 'User create profile',
    body: {
      type: CreateProfileReqDto,
    },
    responses: [
      {
        type: ProfileResDto,
        status: HttpStatus.CREATED,
      },
    ],
  },
  [EAccountOperation.USER_UPDATE_PROFILE]: {
    operationId: EAccountOperation.USER_UPDATE_PROFILE,
    summary: 'User update profile',
    body: {
      type: UpdateProfileReqDto,
    },
    responses: [
      {
        type: ProfileResDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [EAccountOperation.USER_READ_PROFILE]: {
    operationId: EAccountOperation.USER_READ_PROFILE,
    summary: 'User read profile',
    responses: [
      {
        type: ProfileResDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [EAccountOperation.USER_UPLOAD_PHOTO]: {
    operationId: EAccountOperation.USER_UPLOAD_PHOTO,
    summary: 'User upload photo and get url',
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
  [EAccountOperation.PUBLIC_READ_PROFILE]: {
    operationId: EAccountOperation.PUBLIC_READ_PROFILE,
    summary: 'Public read profile',
    responses: [
      {
        type: ProfileResDto,
        status: HttpStatus.OK,
      },
    ],
  },
};
