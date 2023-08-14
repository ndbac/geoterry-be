import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { from } from 'rxjs';
import { TerryDocument } from 'src/modules/terry/terry.model';
import { convertObject } from 'src/shared/mongoose/helpers';
import { Document2Interface } from 'src/shared/mongoose/types';
import _ from 'lodash';
import { mergeMap } from 'rxjs/operators';
import { ProfileRepository } from 'src/modules/profile/profile.repository';
import { ProfileDocument } from 'src/modules/profile/profile.model';

@Injectable()
export class InjectProfileToTerryInterceptor implements NestInterceptor {
  constructor(private readonly profileRepo: ProfileRepository) {}
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<
      Document2Interface<TerryDocument> | Document2Interface<TerryDocument>[]
    >,
  ) {
    if (ctx.switchToHttp().getRequest().query['includeProfileData'] !== 'true')
      return next.handle();
    return next
      .handle()
      .pipe(mergeMap((data) => from(this.injectData(convertObject(data)))));
  }

  async injectData(
    data:
      | Document2Interface<TerryDocument>
      | Document2Interface<TerryDocument>[],
  ) {
    const profileMappedById = await this.getProfileMappedById(
      Array.isArray(data) ? data : [data],
    );
    if (Array.isArray(data)) {
      data.forEach((terry) => {
        if (terry.categoryIds) {
          (terry as any).profile = this.addProfileToTerry(
            terry,
            profileMappedById,
          );
        }
      });
    } else {
      (data as any).profile = this.addProfileToTerry(data, profileMappedById);
    }
    return data;
  }

  addProfileToTerry(
    terry: Document2Interface<TerryDocument>,
    profileMappedById: _.Dictionary<ProfileDocument>,
  ) {
    return _.pick(profileMappedById[terry.profileId], [
      'id',
      'displayName',
      'logoUrl',
    ]);
  }

  async getProfileMappedById(terries: Document2Interface<TerryDocument>[]) {
    const profileIds = _.uniq(terries.map((terry) => terry.profileId));
    const profileData = await this.profileRepo.find({
      _id: { $in: profileIds },
    });
    return _.mapKeys(profileData, 'id');
  }
}
