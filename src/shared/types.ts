import {
  ApiBodyOptions,
  ApiParamOptions,
  ApiQueryOptions,
  ApiResponseOptions,
} from '@nestjs/swagger';
import { IIamUserData } from 'src/guards/types';
import { Request } from 'express';

export enum CollectionName {
  ACCOUNTS = 'accounts',
  ACCOUNT_METADATA = 'account-metadatas',
  PROFILES = 'profiles',
  TERRIES = 'terries',
  TERRY_CATEGORIES = 'terry-categories',
  TERRY_REPORTS = 'terry-reports',
  TERRY_CHECKINS = 'terry-checkins',
  NOTIFICATION_HISTORIES = 'notification-histories',
  DEVICES = 'devices',
  CONVERSATIONS = 'conversations',
  MESSAGES = 'messages',
  TERRY_USER_MAPPINGS = 'terry-user-mappings',
  TERRY_USER_PATHS = 'terry-user-paths',
  APP_GLOBALS = 'app-globals',
}

export type PossiblyAsync<T> = T | Promise<T>;

export type Emptyable<T> = T | undefined | null;
export type NonEmptyable<T> = Exclude<T, undefined | null>;
export type MakeEmptyable<From, To> = null extends From
  ? undefined extends From
    ? To | null | undefined
    : To | null
  : To;

export interface IPagination {
  page: number;
  pageSize: number;
  offset: number;
}

export interface IPaginationOptions {
  maxLimit?: number;
}

export interface IEndpointConfiguration {
  operationId: string;
  description?: string;
  deprecated?: boolean;
  summary?: string;
  params?: ApiParamOptions[];
  body?: ApiBodyOptions;
  query?: ApiQueryOptions[];
  contentTypes?: string[];
  responses?: ApiResponseOptions[];
}

export interface IPaginationHeader {
  'x-geoterry-pagination-page': number;
  'x-geoterry-pagination-page-size': number;
  'x-geoterry-pagination-total': number;
}

export interface IPaginationResponse<T> {
  items: T[];
  headers: IPaginationHeader;
}

export enum LanguageCode {
  ENGLISH = 'en',
  VIETNAMESE = 'vn',
  TAIWANESE = 'tw',
}

export enum EHeadersContentType {
  APPLICATION_JSON = 'application/json',
}

export enum IamNamespace {
  GEOTERRY_ADMINS = 'geoterry-admins',
  GEOTERRY_BUILDERS = 'geoterry-builders',
  GEOTERRY_HUNTERS = 'geoterry-hunters',
}

export enum IAccountRole {
  PARTNER = 'partner',
  USER = 'user',
}

export enum EIdentifierType {
  PHONE_NUMBER = 'phone_number',
  EMAIL = 'email',
}

export interface IRequestWithUserCtx extends Request {
  user: IIamUserData;
}

export enum GeneralActionStatus {
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

export enum ECommonFindAspects {
  ID = 'id',
  SLUG = 'slug',
}
