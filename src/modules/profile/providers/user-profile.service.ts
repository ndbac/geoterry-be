import { Injectable } from '@nestjs/common';
import { UpdateProfileReqDto } from '../dto/update-profile.dto';
import { ProfileRepository } from '../profile.repository';
import { ICreateProfileData } from '../profile.types';
import { throwStandardError } from 'src/errors/helpers';
import { ErrorCode } from 'src/errors/error-defs';

@Injectable()
export class UserProfileService {
  constructor(private readonly profileRepo: ProfileRepository) {}

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
    return this.profileRepo.findOneOrFail({
      userId,
    });
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
}
