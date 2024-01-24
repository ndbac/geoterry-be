import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import _ from 'lodash';
import { map } from 'rxjs';
import { TerryDocument } from 'src/modules/terry/terry.model';
import { convertObject } from 'src/shared/mongoose/helpers';
import { Document2Interface } from 'src/shared/mongoose/types';

@Injectable()
export class MaskedTerrySensitiveInfoInterceptor implements NestInterceptor {
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<
      Document2Interface<TerryDocument> | Document2Interface<TerryDocument>[]
    >,
  ) {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((c) => {
            return this.masked(c);
          });
        }
        return this.masked(data);
      }),
    );
  }

  masked(terry: Document2Interface<TerryDocument>) {
    return _.omit(convertObject(terry), 'code');
  }
}
