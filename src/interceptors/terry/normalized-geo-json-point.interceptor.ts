import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { TerryDocument } from 'src/modules/terry/terry.model';
import { convertObject } from 'src/shared/mongoose/helpers';
import { Document2Interface } from 'src/shared/mongoose/types';

@Injectable()
export class NormalizedGeoJsonPointInterceptor implements NestInterceptor {
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
            return this.normalizedGeoJsonPoint(c);
          });
        }
        return this.normalizedGeoJsonPoint(data);
      }),
    );
  }

  normalizedGeoJsonPoint(terry: Document2Interface<TerryDocument>) {
    return {
      ...convertObject(terry),
      location: {
        latitude: terry.location.coordinates[1],
        longitude: terry.location.coordinates[0],
      },
    };
  }
}
