import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { from } from 'rxjs';
import { convertObject } from 'src/shared/mongoose/helpers';
import { Document2Interface } from 'src/shared/mongoose/types';
import _ from 'lodash';
import { mergeMap } from 'rxjs/operators';
import { ProfileRepository } from 'src/modules/profile/profile.repository';
import { ProfileDocument } from 'src/modules/profile/profile.model';
import { TerryCheckinDocument } from 'src/modules/terry-checkin/terry-checkin.model';

@Injectable()
export class InjectProfileToTerryCheckinInterceptor implements NestInterceptor {
  constructor(private readonly profileRepo: ProfileRepository) {}
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<
      | Document2Interface<TerryCheckinDocument>
      | Document2Interface<TerryCheckinDocument>[]
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
      | Document2Interface<TerryCheckinDocument>
      | Document2Interface<TerryCheckinDocument>[],
  ) {
    const profileMappedById = await this.getProfileMappedById(
      Array.isArray(data) ? data : [data],
    );
    if (Array.isArray(data)) {
      data.forEach((terryCheckin) => {
        (terryCheckin as any).profile = this.addProfileToTerryCheckin(
          terryCheckin,
          profileMappedById,
        );
      });
    } else {
      (data as any).profile = this.addProfileToTerryCheckin(
        data,
        profileMappedById,
      );
    }
    return data;
  }

  addProfileToTerryCheckin(
    terryCheckin: Document2Interface<TerryCheckinDocument>,
    profileMappedById: _.Dictionary<ProfileDocument>,
  ) {
    return _.pick(profileMappedById[terryCheckin.profileId], [
      'id',
      'displayName',
      'logoUrl',
      'slug',
    ]);
  }

  async getProfileMappedById(
    terryCheckinList: Document2Interface<TerryCheckinDocument>[],
  ) {
    const profileIds = _.uniq(
      terryCheckinList.map((terryCheckin) => terryCheckin.profileId),
    );
    const profileData = await this.profileRepo.find({
      _id: { $in: profileIds },
    });
    return _.mapKeys(profileData, 'id');
  }
}
