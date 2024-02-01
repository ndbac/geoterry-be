import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import { UploadPhotoDto, UploadPhotoResponseDto } from '../dto/common.dto';
import { CreateProfileReqDto } from '../dto/create-profile.dto';
import {
  ProfileResDto,
  UserGetProfileNearbyResDto,
} from '../dto/profile-response.dto';
import {
  UpdateProfileLocationReqDto,
  UpdateProfileReqDto,
} from '../dto/update-profile.dto';
import { UserGetProfileNearbyReqDto } from '../dto/profile.dto';

export enum EAccountOperation {
  USER_CREATE_PROFILE = 'userCreateProfile',
  USER_UPDATE_PROFILE = 'userUpdateProfile',
  USER_READ_PROFILE = 'userReadProfile',
  USER_READ_OTHER_PROFILE = 'userReadOtherProfile',
  USER_UPLOAD_PHOTO = 'userUploadPhoto',
  PUBLIC_READ_PROFILE = 'publicReadProfile',
  USER_UPDATE_PROFILE_LOCATION = 'userUpdateProfileLocation',
  USER_GET_PROFILE_NEARBY = 'userGetProfileNearby',
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
  [EAccountOperation.USER_READ_OTHER_PROFILE]: {
    operationId: EAccountOperation.USER_READ_OTHER_PROFILE,
    summary: 'User read other profile',
    params: [
      {
        name: 'profileId',
      },
    ],
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
  [EAccountOperation.USER_UPDATE_PROFILE_LOCATION]: {
    operationId: EAccountOperation.USER_UPDATE_PROFILE_LOCATION,
    summary: 'User update profile location',
    body: {
      type: UpdateProfileLocationReqDto,
    },
    responses: [
      {
        type: ProfileResDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [EAccountOperation.USER_GET_PROFILE_NEARBY]: {
    operationId: EAccountOperation.USER_GET_PROFILE_NEARBY,
    summary: 'User get profiles nearby',
    body: {
      type: UserGetProfileNearbyReqDto,
    },
    responses: [
      {
        type: [UserGetProfileNearbyResDto],
        status: HttpStatus.OK,
      },
    ],
  },
};
