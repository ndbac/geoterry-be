import { Injectable } from '@nestjs/common';
import { TerryCheckinRepository } from '../terry-checkin.repository';
import { TerryCheckinInputDto } from '../dto/terry-checkin.dto';
import { TerryRepository } from 'src/modules/terry/terry.repository';
import { throwStandardError } from 'src/errors/helpers';
import { ErrorCode } from 'src/errors/error-defs';
import config from 'config';
import haversine from 'haversine-distance';

@Injectable()
export class TerryCheckinService {
  constructor(
    private readonly terryReportRepo: TerryCheckinRepository,
    private readonly terryRepo: TerryRepository,
  ) {}

  async checkin(data: TerryCheckinInputDto, profileId: string) {
    const terry = await this.terryRepo.findByIdOrFail(data.terryId);
    if (!terry.isAvailable || terry.profileId === profileId) {
      return throwStandardError(ErrorCode.INVALID_TERRY);
    }
    const maxDistance = config.get<number>('terry.maxDistanceToCheckin');
    const distance = haversine(data.location, {
      latitude: terry.location.coordinates[1],
      longitude: terry.location.coordinates[0],
    });
    if (distance > maxDistance) {
      return throwStandardError(ErrorCode.OUT_OF_DISTANCE);
    }
    return this.terryReportRepo.create({ profileId, ...data });
  }
}
