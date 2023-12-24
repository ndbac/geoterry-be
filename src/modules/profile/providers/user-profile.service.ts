import { convertObject } from 'src/shared/mongoose/helpers';
import { Injectable } from '@nestjs/common';
import {
  UpdateProfileLocationReqDto,
  UpdateProfileReqDto,
} from '../dto/update-profile.dto';
import { ProfileRepository } from '../profile.repository';
import { ICreateProfileData } from '../profile.types';
import { throwStandardError } from 'src/errors/helpers';
import { ErrorCode } from 'src/errors/error-defs';
import { AccountRepository } from 'src/modules/account/accounts.repository';
import { AccountMetadataRepository } from 'src/modules/account/account-metadata.repository';
import { ERoleRequestStatus } from 'src/modules/account/types';
import { MongoLocationType } from 'src/shared/mongoose/types';
import { UserGetProfileNearbyReqDto } from '../dto/profile.dto';
import { PROFILE_NEARBY_MAX_DISTANCE_IN_METER_DEFAULT } from 'src/modules/terry/constants';
import { sub } from 'date-fns';
import { RtdbService } from 'src/modules/adapters/firebase/rtdb.provider';
import { getLocationPath } from 'src/shared/firebase.helpers';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly profileRepo: ProfileRepository,
    private readonly acccountRepo: AccountRepository,
    private readonly accountMetadataRepo: AccountMetadataRepository,
    private readonly rtdbSvc: RtdbService,
  ) {}

  async onboardProfile(input: ICreateProfileData) {
    return this.profileRepo.withTransaction(async (session) => {
      const profile = await this.profileRepo.create(
        {
          userId: input.userId,
          displayName: input.displayName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          bio: input.bio,
          logoUrl: input.logoUrl,
          languageCode: input.languageCode,
          slug: input.slug,
        },
        { session },
      );
      return profile;
    });
  }

  async readProfile(userId: string) {
    const account = await this.acccountRepo.findByIdOrFail(userId);
    const profile = await this.profileRepo.findOneOrFail({
      userId,
    });
    const metadata = await this.accountMetadataRepo.findOne({ userId });
    return {
      role: account.role,
      roleRequestingStatus:
        metadata?.roleRequest?.status !== ERoleRequestStatus.ACCEPTED
          ? metadata?.roleRequest?.status
          : undefined,
      roleRequesting:
        metadata?.roleRequest?.status !== ERoleRequestStatus.ACCEPTED
          ? metadata?.roleRequest?.role
          : undefined,
      ...convertObject(profile),
    };
  }

  async updateProfile(userId: string, input: UpdateProfileReqDto) {
    return this.profileRepo.withTransaction(async (session) => {
      const profile = await this.profileRepo.findOneOrFail(
        {
          userId,
        },
        { session },
      );

      // check if slug is already taken
      if (input?.slug) {
        const existedSlug = await this.profileRepo.exists(
          {
            slug: input.slug,
            userId: { $nin: [userId] },
          },
          { session },
        );
        if (existedSlug) {
          return throwStandardError(ErrorCode.DUPLICATED_SLUG);
        }
      }
      return this.profileRepo.updateById(profile.id, input, { session });
    });
  }

  async updateProfileLocation(
    userId: string,
    input: UpdateProfileLocationReqDto,
  ) {
    const profile = await this.profileRepo.updateOne(
      {
        userId,
      },
      {
        lastLocation: {
          type: MongoLocationType.POINT,
          coordinates: [input.longitude, input.latitude],
          updatedAt: new Date(),
        },
      },
    );

    if (!profile) {
      return this.profileRepo.throwErrorNotFound();
    }

    await this.asyncLocationToRtdb(
      profile.id,
      input.latitude,
      input.longitude,
      profile.lastLocation?.updatedAt || new Date(),
    );

    return profile;
  }

  async getProfileNearby(userId: string, input: UserGetProfileNearbyReqDto) {
    return this.profileRepo.withTransaction(async (session) => {
      let currentLocation = {
        latitude: input.latitude,
        longitude: input.longitude,
      };
      if (!currentLocation.latitude || !currentLocation.longitude) {
        const profile = await this.profileRepo.findOneOrFail(
          {
            userId,
          },
          { session },
        );
        if (!profile.lastLocation) return [];
        currentLocation = {
          longitude: profile.lastLocation.coordinates[0],
          latitude: profile.lastLocation.coordinates[1],
        };
      } else {
        // update last location of user
        const profile = await this.profileRepo.updateOne(
          {
            userId,
          },
          {
            lastLocation: {
              type: MongoLocationType.POINT,
              coordinates: [
                currentLocation.longitude,
                currentLocation.latitude,
              ],
              updatedAt: new Date(),
            },
          },
          { session },
        );
        profile &&
          (await this.asyncLocationToRtdb(
            profile.id,
            currentLocation.latitude,
            currentLocation.longitude,
            profile.lastLocation?.updatedAt || new Date(),
          ));
      }
      const profiles = await this.profileRepo.find(
        {
          lastLocation: {
            $near: {
              $geometry: {
                type: MongoLocationType.POINT,
                coordinates: [
                  currentLocation.longitude,
                  currentLocation.latitude,
                ],
              },
              $maxDistance: PROFILE_NEARBY_MAX_DISTANCE_IN_METER_DEFAULT,
            },
          },
          userId: { $nin: [userId] },
          'lastLocation.updatedAt': {
            // only return players that have updated their location in the last 5 minutes
            // that mean thoese only are online
            $gte: sub(new Date(), { minutes: 5 }),
          },
        },
        { session },
      );
      return profiles.map((profile) => ({ profileId: profile.id }));
    });
  }

  private async asyncLocationToRtdb(
    profileId: string,
    latitude: number,
    longitude: number,
    updatedAt: Date,
  ) {
    await this.rtdbSvc.updateByPathOrCreate(getLocationPath(profileId), {
      location: {
        latitude,
        longitude,
      },
      updatedAt: updatedAt.getTime(),
    });
  }
}
