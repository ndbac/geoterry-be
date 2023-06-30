import { Injectable } from '@nestjs/common';
import { ProfileRepository } from '../profile.repository';
import { PublicReadProfileQueryDto } from '../dto/profile.dto';
import { ECommonFindAspects } from 'src/shared/types';

@Injectable()
export class PublicProfileService {
  constructor(private readonly profileRepo: ProfileRepository) {}

  async readProfile(slug: string, query: PublicReadProfileQueryDto) {
    if (query.findBy === ECommonFindAspects.ID) {
      return this.profileRepo.findByIdOrFail(slug);
    }
    return this.profileRepo.findOneOrFail({ slug });
  }
}
