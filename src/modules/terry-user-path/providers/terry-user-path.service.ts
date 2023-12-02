import { Injectable } from '@nestjs/common';
import { TerryUserPathRepository } from '../terry-user-path.repository';
import { TerryRepository } from 'src/modules/terry/terry.repository';
import { throwStandardError } from 'src/errors/helpers';
import { ErrorCode } from 'src/errors/error-defs';
import { TerryUserPathInputDto } from '../dto/terry-user-path.dto';
import { TerryUserMappingRepository } from 'src/modules/terry-user-mapping/terry-user-mapping.repository';

@Injectable()
export class TerryUserPathService {
  constructor(
    private readonly terryUserPathRepo: TerryUserPathRepository,
    private readonly terryRepo: TerryRepository,
    private readonly terryUserMappingRepo: TerryUserMappingRepository,
  ) {}

  /**
   * @deprecated since move to use terry-user-mapping
   */
  async get(profileId: string, terryId: string) {
    return this.terryUserPathRepo.findOneOrFail({ profileId, terryId });
  }

  /**
   * @deprecated since move to use terry-user-mapping
   */
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
        profileId,
        terryId,
        ...(data.path ? { path: data.path } : []),
      },
    );
  }

  async upsertPath(
    data: TerryUserPathInputDto,
    profileId: string,
    terryId: string,
  ) {
    const terry = await this.terryRepo.findByIdOrFail(terryId);
    if (!terry.isAvailable) {
      return throwStandardError(ErrorCode.INVALID_TERRY);
    }
    return this.terryUserMappingRepo.updateOneOrCreate(
      { profileId, terryId },
      {
        profileId,
        terryId,
        ...(data.path ? { path: data.path } : []),
      },
    );
  }
}
