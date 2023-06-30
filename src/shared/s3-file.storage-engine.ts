import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Logger as NestPinoLogger, PinoLogger } from 'nestjs-pino';
import { S3 } from 'aws-sdk';
import { StorageEngine } from 'multer';
import config from 'config';
import path from 'path';
import { Request } from 'express';
import convert from 'heic-convert';
import getStream from 'get-stream';
import { IRequestWithUserCtx, PossiblyAsync } from './types';
import { throwStandardError } from 'src/errors/helpers';
import { ErrorCode } from 'src/errors/error-defs';

export interface IS3FileStorageEngineOptions {
  generateId: (
    req: Request,
    file: Express.Multer.File,
  ) => string | Promise<string>;
  keyPrefix: string;
  getFinalLocation?: (data: { bucket: string; key: string }) => string;
  preCheckBeforeUploaded?: (
    req: Request,
    file: Express.Multer.File,
  ) => PossiblyAsync<boolean>;
}

export enum EImageConversionOutputFormat {
  JPEG = 'JPEG',
  PNG = 'PNG',
}

export type LoggerType = Logger | NestPinoLogger | PinoLogger;

const IOS_IMAGE_EXTENSIONS = ['.heic', '.HEIC', '.heif', '.HEIF'];

const ALLOWED_FILE_TYPES = config.get<string[]>('imageUpload.acceptedTypes');

@Injectable()
export class S3FileStorageEngine implements StorageEngine {
  private readonly logger: LoggerType;
  constructor(
    private readonly s3Service: S3,
    private readonly opt: IS3FileStorageEngineOptions,
    logger?: LoggerType,
  ) {
    if (logger) {
      this.logger = logger;
    } else {
      this.logger = new Logger(S3FileStorageEngine.name);
    }
  }

  _handleFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: any) => void,
  ) {
    this.handleFile(req, file)
      .then((result) => callback(null, result))
      .catch((err) => callback(err, null));
  }

  private async handleFile(req: Request, file: Express.Multer.File) {
    if (
      (this.opt.preCheckBeforeUploaded &&
        !(await this.opt.preCheckBeforeUploaded(req, file))) ||
      !this.validateFile(req, file)
    ) {
      return throwStandardError(ErrorCode.UPLOAD_FILE_FAILED, {
        message: 'Cannot upload file due to failed pre-conditioned checks',
      });
    }

    const fileObjectId = await this.opt.generateId(req, file);

    const body = await this.convertImageIfNecessary(file);

    const result = await this.s3Service
      .upload({
        Bucket: config.get<string>('aws.s3.bucket'),
        Key: this.getKey(fileObjectId, file),
        Body: body,
        ACL: 'public-read',
      })
      .promise();
    return {
      path:
        this.opt?.getFinalLocation?.({
          bucket: result.Bucket,
          key: result.Key,
        }) || result.Location,
      id: fileObjectId,
    };
  }

  _removeFile(
    req: IRequestWithUserCtx,
    file: Express.Multer.File,
    callback: (error: Error | null) => void,
  ) {
    callback(
      new InternalServerErrorException({
        message: 'Error while uploading the image',
      }),
    );
  }

  private getKey(fileObjectId: string, file: Express.Multer.File) {
    const extension = this.getFileExtension(file);
    return `${this.opt.keyPrefix}/${fileObjectId}${extension}`;
  }

  private async convertImageIfNecessary(file: Express.Multer.File) {
    let input = await getStream.buffer(file.stream);

    if (this.isIOSLiveImage(file)) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        input = await convert({
          buffer: input,
          format: EImageConversionOutputFormat.JPEG,
          quality: 1,
        });
      } catch (error) {
        // Image has .heic extension but is not really .heic
        this.logger.debug(error);
      }
    }

    return input;
  }

  private getFileExtension(file: Express.Multer.File) {
    // If IOS live image, convert to .jpg
    return this.isIOSLiveImage(file) ? '.jpg' : path.extname(file.originalname);
  }

  private isIOSLiveImage(file: Express.Multer.File) {
    return IOS_IMAGE_EXTENSIONS.includes(path.extname(file.originalname));
  }

  private validateFile(req: Request, file: Express.Multer.File) {
    const fileType = file.mimetype?.split('/')?.[0]?.toLowerCase();
    return ALLOWED_FILE_TYPES.includes(fileType);
  }
}
