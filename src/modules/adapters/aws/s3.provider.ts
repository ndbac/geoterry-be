import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import config from 'config';
import { IUploadFileToS3Input, IUploadFileToS3FromUrlInput } from './types';
import axios from 'axios';
import { PassThrough } from 'stream';
import { getFileExtensionFromContentType } from 'src/shared/helpers';

export const S3_PROVIDER = 'geoterry-be-s3';

export const s3Provider = {
  provide: S3_PROVIDER,
  useFactory: (): S3 => {
    const s3 = new S3({
      accessKeyId: config.get('aws.accessKeyId'),
      secretAccessKey: config.get('aws.secretAccessKey'),
      region: config.get('aws.region'),
      signatureVersion: config.get<string>('aws.s3.signatureVersion'),
    });
    return s3;
  },
};

@Injectable()
export class AwsS3Service {
  constructor(
    @Inject(S3_PROVIDER)
    private readonly s3: S3,
  ) {}

  async uploadFileToS3({ key, bucket, file }: IUploadFileToS3Input) {
    const res = await this.s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: file,
      })
      .promise();

    return {
      key: res.Key,
      s3Url: res.Location,
    };
  }

  async uploadFileToS3FromUrl({
    url,
    bucket,
    keyWithoutExt,
  }: IUploadFileToS3FromUrlInput) {
    const passThru = new PassThrough();
    let ext = '.';
    await axios({
      method: 'get',
      url,
      responseType: 'stream',
    }).then((response) => {
      if (response.status === HttpStatus.OK) {
        ext = getFileExtensionFromContentType(response.headers['content-type']);
        response.data.pipe(passThru);
      }
    });
    const key = ext === '.' ? keyWithoutExt : `${keyWithoutExt}${ext}`;

    const promise = this.s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: passThru,
      })
      .promise();

    return new Promise<{ key: string; s3Url: string }>((resolve, reject) => {
      passThru.on('error', (error) => reject(error));
      passThru.on('end', () => {
        promise
          .then((result) => {
            resolve({
              key,
              s3Url: result.Location,
            });
          })
          .catch((error) => reject(error));
      });
    });
  }
}
