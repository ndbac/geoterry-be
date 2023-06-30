import { ProfileRepository } from 'src/modules/profile/profile.repository';
import { Injectable, PipeTransform } from '@nestjs/common';
import { UserCreateProfileInputWithUserContextDto } from 'src/modules/profile/dto/create-profile.dto';
import slugify from 'slugify';
import { IIamUserData } from 'src/guards/types';
import { ErrorCode } from 'src/errors/error-defs';
import { throwStandardError } from 'src/errors/helpers';

@Injectable()
export class ProfileInputTransformerPipe implements PipeTransform {
  constructor(private readonly profileRepo: ProfileRepository) {}

  transform(value: UserCreateProfileInputWithUserContextDto) {
    return this.transformCreateProfileData(value);
  }

  async transformCreateProfileData({
    data,
    user,
  }: UserCreateProfileInputWithUserContextDto) {
    await this.isEligibleToCreateProfile(user);

    const slug = slugify(data.displayName) || Date.now();
    const isExistedSlug = await this.profileRepo.exists({ slug });
    return {
      user,
      data: {
        ...data,
        userId: user.userId,
        slug: isExistedSlug ? `${slug}-${Date.now()}` : slug,
      },
    };
  }

  private async isEligibleToCreateProfile(user: IIamUserData) {
    const isExistedProfile = await this.profileRepo.exists({
      userId: user.userId,
    });
    if (isExistedProfile) throwStandardError(ErrorCode.ALREADY_ONBOARD_PROFILE);
  }
}
