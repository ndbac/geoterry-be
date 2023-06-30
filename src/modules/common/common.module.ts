import { Module } from '@nestjs/common';
import { AwsSdkModule } from '../adapters/aws/aws-sdk.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { BcryptService } from './bcrypt/bcrypt.service';
import { JwtService } from './jsonwebtoken/jwt.service';
import { QrCodeModule } from './qrcode/qrcode.module';
import { QRCodeService } from './qrcode/qrcode.provider';

const providers = [JwtService, BcryptService, QRCodeService];
@Module({
  imports: [BcryptModule, AwsSdkModule, QrCodeModule],
  providers,
  exports: providers,
})
export class CommonModule {}
