import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { Multer } from 'multer';
import config from 'config';
import { ErrorCode } from 'src/errors/error-defs';
import { throwStandardError } from 'src/errors/helpers';

export class S3UploadFileBaseInterceptor implements NestInterceptor {
  fileHandler: Multer;
  s3Service: S3;
  fileSizeCheckOption: {
    enabled: boolean;
    limit: number;
  };
  constructor() {
    this.fileSizeCheckOption = {
      enabled: true,
      limit: Number(config.get<Record<string, string>>('imageUpload.size').max),
    };
  }
  async intercept(ctx: ExecutionContext, call$: CallHandler) {
    const req = ctx.switchToHttp().getRequest();

    if (
      this.fileSizeCheckOption.enabled &&
      parseInt(req.headers['content-length']) > this.fileSizeCheckOption.limit
    ) {
      return throwStandardError(ErrorCode.SIZE_IMAGE_NOT_ACCEPTED, {
        args: {
          maxFileSize:
            config.get<Record<string, string>>('imageUpload.size')
              .maxConvertToString,
        },
      });
    }

    await new Promise<void>((resolve, reject) =>
      this.fileHandler.single('file')(
        ctx.switchToHttp().getRequest(),
        ctx.switchToHttp().getResponse(),
        (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        },
      ),
    );
    return call$.handle();
  }
}
