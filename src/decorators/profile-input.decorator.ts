import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EXCLUDE_REQ_CTX_VALIDATION_PIPE } from 'src/pipes/general-validation.pipe';
import { ProfileInputTransformerPipe } from 'src/pipes/profile/profile-input.pipe';
import { IRequestWithUserCtx } from 'src/shared/types';

export const ExtractCreateProfileInput = () =>
  createParamDecorator((data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<IRequestWithUserCtx>();

    return {
      user: req.user,
      profileId: req.params?.profileId,
      data: req.body,
    };
  })(EXCLUDE_REQ_CTX_VALIDATION_PIPE, ProfileInputTransformerPipe);
