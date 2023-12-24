import { AUTH_METADATA_KEY } from 'src/shared/constants';
import { IRequestWithUserCtx } from './../shared/types';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthEndpointDto } from 'src/decorators/auth-endpoint.decorator';
import _ from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext) {
    const authMetadata = this.reflector.get<AuthEndpointDto | undefined>(
      AUTH_METADATA_KEY,
      ctx.getHandler(),
    );
    const authReq = ctx.switchToHttp().getRequest<IRequestWithUserCtx>();

    if (
      authMetadata?.rolesRequired &&
      !_.isEmpty(authMetadata?.rolesRequired)
    ) {
      let shouldAllow = true;
      authMetadata.rolesRequired.forEach((roleRequired) => {
        if (
          authReq.user.namespace === roleRequired.namespace &&
          !roleRequired.roles.includes(authReq.user.role)
        ) {
          shouldAllow = false;
        }
      });
      if (!shouldAllow) return shouldAllow;
    }

    return (
      !authMetadata ||
      (authReq.user &&
        authMetadata?.namespaces?.includes(authReq.user.namespace)) ||
      (!authReq.user && !!authMetadata.isPublic)
    );
  }
}
