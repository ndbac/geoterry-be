import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import _ from 'lodash';
import { map } from 'rxjs';
import { AccountDocument } from 'src/modules/account/accounts.model';
import { convertObject } from 'src/shared/mongoose/helpers';
import { Document2Interface } from 'src/shared/mongoose/types';

@Injectable()
export class MaskCredentialsInAccountInterceptor implements NestInterceptor {
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<
      | Document2Interface<AccountDocument>
      | Document2Interface<AccountDocument>[]
    >,
  ) {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((c) => {
            return this.maskCredInAccount(c);
          });
        }
        return this.maskCredInAccount(data);
      }),
    );
  }

  maskCredInAccount(account: Document2Interface<AccountDocument>) {
    return _.omit(convertObject(account), ['credentials.password']);
  }
}
