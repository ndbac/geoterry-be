import { Module } from '@nestjs/common';
import { AwsSdkModule } from 'src/modules/adapters/aws/aws-sdk.module';
import { QRCodeService } from './qrcode.provider';

@Module({
  imports: [AwsSdkModule],
  providers: [QRCodeService],
  exports: [QRCodeService],
})
export class QrCodeModule {}
