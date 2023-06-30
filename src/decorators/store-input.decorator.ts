import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EXCLUDE_REQ_CTX_VALIDATION_PIPE } from 'src/pipes/general-validation.pipe';
import { StoreInputTransformerPipe } from 'src/pipes/stores/store-input.pipe';
import { IRequestWithUserCtx } from 'src/shared/types';

export const ExtractCreateStoreInput = () =>
  createParamDecorator((data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<IRequestWithUserCtx>();

    return {
      user: req.user,
      storeId: req.params?.storeId,
      data: req.body,
    };
  })(EXCLUDE_REQ_CTX_VALIDATION_PIPE, StoreInputTransformerPipe);
