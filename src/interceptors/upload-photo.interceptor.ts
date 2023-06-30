import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import config from 'config';
import multer, { Multer } from 'multer';
import { S3_PROVIDER } from 'src/modules/adapters/aws/s3.provider';
import { S3FileStorageEngine } from 'src/shared/s3-file.storage-engine';
import { IRequestWithUserCtx } from 'src/shared/types';
import { v4 as uuidV4 } from 'uuid';
import { S3UploadFileBaseInterceptor } from './common/s3-upload-file.base.interceptor';

@Injectable()
export class UploadPhotoInterceptor extends S3UploadFileBaseInterceptor {
  fileHandler: Multer;
  constructor(
    @Inject(S3_PROVIDER)
    public readonly s3Service: S3,
  ) {
    super();
    this.fileHandler = multer({
      storage: new S3FileStorageEngine(this.s3Service, {
        generateId: (req: IRequestWithUserCtx) =>
          `geoterryUserId_${req.user.userId}_pictureId_${uuidV4()}`,
        keyPrefix: config.get<string>('aws.s3.photoPrefixKey'),
      }),
    });
  }
}
