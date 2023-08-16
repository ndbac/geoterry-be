import { Injectable } from '@nestjs/common';
import { DeviceRepository } from '../device.repository';
import { CreateOrUpdateDeviceInputDto } from '../dto/device.dto';

@Injectable()
export class DeviceService {
  constructor(private readonly deviceRepo: DeviceRepository) {}

  updateOrCreateDevice(profileId: string, data: CreateOrUpdateDeviceInputDto) {
    return this.deviceRepo.updateOneOrCreate(
      { profileId },
      { profileId, ...data },
    );
  }

  deleteDevice(profileId: string) {
    return this.deviceRepo.deleteOne({ profileId });
  }
}
