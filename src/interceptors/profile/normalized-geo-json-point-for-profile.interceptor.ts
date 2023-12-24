import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { ProfileDocument } from 'src/modules/profile/profile.model';
import { convertObject } from 'src/shared/mongoose/helpers';
import { Document2Interface } from 'src/shared/mongoose/types';

@Injectable()
export class NormalizedGeoJsonPointForProfileInterceptor
  implements NestInterceptor
{
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<
      | Document2Interface<ProfileDocument>
      | Document2Interface<ProfileDocument>[]
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

  normalizedGeoJsonPoint(terry: Document2Interface<ProfileDocument>) {
    return {
      ...convertObject(terry),
      lastLocation: {
        latitude: terry?.lastLocation?.coordinates[1],
        longitude: terry?.lastLocation?.coordinates[0],
        updatedAt: terry?.lastLocation?.updatedAt,
      },
    };
  }
}
