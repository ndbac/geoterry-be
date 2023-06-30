import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import QRCode from 'qrcode';
import fs from 'fs';
import config from 'config';
import { throwStandardError } from 'src/errors/helpers';
import { ErrorCode } from 'src/errors/error-defs';
import { S3_PROVIDER } from 'src/modules/adapters/aws/s3.provider';
import { errorLog } from 'src/shared/logger/logger.helpers';

const tempDir = './temp';

@Injectable()
export class QRCodeService {
  constructor(
    @Inject(S3_PROVIDER)
    private readonly s3Service: S3,
  ) {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
  }

  async generateQrAndUploadToS3(filename: string, content: string) {
    try {
      const realFilename = `${filename}.png`;
      await QRCode.toFile(`${tempDir}/${realFilename}`, content);
      const uploadResult = await this.uploadQrImageToS3(realFilename);
      this.removeTempFile(`${tempDir}/${realFilename}`);
      return uploadResult;
    } catch (err) {
      errorLog(
        { generateQrCodeErr: err },
        undefined,
        'GENERATE AND UPLOAD QR CODE',
      );
      throwStandardError(ErrorCode.CANNOT_GENERATE_QR_CODE);
    }
  }

  async uploadQrImageToS3(filename: string) {
    return this.s3Service
      .upload({
        Bucket: config.get<string>('aws.s3.bucket'),
        Key: `${config.get<string>('aws.s3.photoPrefixKey')}/${filename}`,
        Body: fs.readFileSync(`${tempDir}/${filename}`),
        ACL: 'public-read',
      })
      .promise();
  }

  removeTempFile(filename: string) {
    fs.rmSync(filename);
  }
}
