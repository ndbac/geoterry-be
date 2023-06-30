import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IamNamespace, IRequestWithUserCtx } from 'src/shared/types';
import { StoreRepository } from 'src/modules/store/store.repository';
import { ErrorCode } from 'src/errors/error-defs';
import { throwStandardError } from 'src/errors/helpers';

@Injectable()
export class StoreAccessGuard implements CanActivate {
  constructor(private readonly storeRepo: StoreRepository) {}
  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<IRequestWithUserCtx>();
    if (req.user.namespace === IamNamespace.GEOTERRY_ADMINS) {
      const store = await this.storeRepo.findById(req.params.storeId);
      if (!store) {
        return throwStandardError(ErrorCode.STORE_NOT_FOUND);
      }
    } else {
      const userId = req.user.userId;
      const storeId = req.params.storeId;
      const userStore = await this.storeRepo.findOne({ userId });
      if (!userStore || String(userStore._id) !== storeId) {
        return throwStandardError(ErrorCode.FORBIDDEN_STORE_ACCESS);
      }
    }
    return true;
  }
}
