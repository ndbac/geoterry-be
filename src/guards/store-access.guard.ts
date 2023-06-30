import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IamNamespace, IRequestWithUserCtx } from 'src/shared/types';
import { ProfileRepository } from 'src/modules/profile/profile.repository';
import { ErrorCode } from 'src/errors/error-defs';
import { throwStandardError } from 'src/errors/helpers';

@Injectable()
export class ProfileAccessGuard implements CanActivate {
  constructor(private readonly profileRepo: ProfileRepository) {}
  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<IRequestWithUserCtx>();
    if (req.user.namespace === IamNamespace.GEOTERRY_ADMINS) {
      const profile = await this.profileRepo.findById(req.params.profileId);
      if (!profile) {
        return throwStandardError(ErrorCode.PROFILE_NOT_FOUND);
      }
    } else {
      const userId = req.user.userId;
      const profileId = req.params.profileId;
      const userProfile = await this.profileRepo.findOne({ userId });
      if (!userProfile || String(userProfile._id) !== profileId) {
        return throwStandardError(ErrorCode.FORBIDDEN_PROFILE_ACCESS);
      }
    }
    return true;
  }
}
