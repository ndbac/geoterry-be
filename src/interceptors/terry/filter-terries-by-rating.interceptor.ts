import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { TerryDocument } from 'src/modules/terry/terry.model';
import { Document2Interface } from 'src/shared/mongoose/types';
import _ from 'lodash';
import { map } from 'rxjs';

@Injectable()
export class FilterTerriesByRatingInterceptor implements NestInterceptor {
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<
      Document2Interface<TerryDocument> | Document2Interface<TerryDocument>[]
    >,
  ) {
    const expectedRating = ctx.switchToHttp().getRequest().body['rate'];
    if (_.isEmpty(expectedRating)) return next.handle();
    return next.handle().pipe(
      map((resBody) => {
        if (_.isArray(resBody)) {
          return resBody.filter(
            (terry) =>
              (terry as any).rating?.rate <= expectedRating.max &&
              (terry as any).rating?.rate >= expectedRating.min,
          );
        }
        return resBody;
      }),
    );
  }
}
