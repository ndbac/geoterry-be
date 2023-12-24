import { Injectable } from '@nestjs/common';
import { TerryUserMappingRepository } from '../terry-user-mapping.repository';
import { UpsertTerryUserMappingInputDto } from '../dto/terry-user-mapping.dto';
import { TerryRepository } from 'src/modules/terry/terry.repository';
import { throwStandardError } from 'src/errors/helpers';
import { ErrorCode } from 'src/errors/error-defs';

@Injectable()
export class TerryUserMappingService {
  constructor(
    private readonly terryUserMappingRepo: TerryUserMappingRepository,
    private readonly terryRepo: TerryRepository,
  ) {}

  async upsert(
    data: UpsertTerryUserMappingInputDto,
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
        terryId,
        profileId,
        ...(data.saved ? { saved: data.saved } : []),
        ...(data.favourite ? { favourite: data.favourite } : []),
        ...(data.path ? { path: data.path } : []),
      },
    );
  }
}
