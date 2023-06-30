import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EIdentifierType, IRequestWithUserCtx } from 'src/shared/types';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IRequestWithUserCtx>();
    switch (data) {
      case 'userId':
        return request.user.userId;
      case 'namespace':
        return request.user.namespace;
      case 'phoneNumber':
        return request.user.identifierType === EIdentifierType.PHONE_NUMBER
          ? request.user.identifier
          : '';
      default:
        return request.user;
    }
  },
);
