import { Injectable } from '@nestjs/common';
import { TerryUserPathRepository } from '../terry-user-path.repository';
import { TerryRepository } from 'src/modules/terry/terry.repository';
import { throwStandardError } from 'src/errors/helpers';
import { ErrorCode } from 'src/errors/error-defs';
import { TerryUserPathInputDto } from '../dto/terry-user-path.dto';

@Injectable()
export class TerryUserPathService {
  constructor(
    private readonly terryUserPathRepo: TerryUserPathRepository,
    private readonly terryRepo: TerryRepository,
  ) {}

  async get(profileId: string, terryId: string) {
    return this.terryUserPathRepo.findOneOrFail({ profileId, terryId });
  }

  async upsert(
    data: TerryUserPathInputDto,
    profileId: string,
    terryId: string,
  ) {
    const terry = await this.terryRepo.findByIdOrFail(terryId);
    if (!terry.isAvailable) {
      return throwStandardError(ErrorCode.INVALID_TERRY);
    }
    return this.terryUserPathRepo.updateOneOrCreate(
      { profileId, terryId },
      {
        ...(data.coordinates ? { coordinates: data.coordinates } : []),
      },
    );
  }
}
