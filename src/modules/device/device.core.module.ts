import { DeviceDocument } from './device.model';
import { CollectionName } from 'src/shared/types';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceRepository } from './device.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CollectionName.DEVICES, schema: DeviceDocument.schema },
    ]),
  ],
  providers: [DeviceRepository],
  exports: [DeviceRepository],
})
export class DeviceCoreModule {}
