import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { from } from 'rxjs';
import { convertObject } from 'src/shared/mongoose/helpers';
import { Document2Interface } from 'src/shared/mongoose/types';
import _ from 'lodash';
import { mergeMap } from 'rxjs/operators';
import { TerryCheckinDocument } from 'src/modules/terry-checkin/terry-checkin.model';
import { TerryRepository } from 'src/modules/terry/terry.repository';
import { TerryDocument } from 'src/modules/terry/terry.model';

@Injectable()
export class InjectTerryToTerryCheckinInterceptor implements NestInterceptor {
  constructor(private readonly terryRepo: TerryRepository) {}
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<
      | Document2Interface<TerryCheckinDocument>
      | Document2Interface<TerryCheckinDocument>[]
    >,
  ) {
    if (ctx.switchToHttp().getRequest().query['includeTerryData'] !== 'true')
      return next.handle();
    return next
      .handle()
      .pipe(mergeMap((data) => from(this.injectData(convertObject(data)))));
  }

  async injectData(
    data:
      | Document2Interface<TerryCheckinDocument>
      | Document2Interface<TerryCheckinDocument>[],
  ) {
    const terryMappedById = await this.getTerryMappedById(
      Array.isArray(data) ? data : [data],
    );
    if (Array.isArray(data)) {
      data.forEach((terryCheckin) => {
        (terryCheckin as any).terry = this.addTerryToTerryCheckin(
          terryCheckin,
          terryMappedById,
        );
      });
    } else {
      (data as any).terry = this.addTerryToTerryCheckin(data, terryMappedById);
    }
    return data;
  }

  addTerryToTerryCheckin(
    terryCheckin: Document2Interface<TerryCheckinDocument>,
    terryMappedById: _.Dictionary<TerryDocument>,
  ) {
    if (!terryMappedById[terryCheckin.terryId]) return undefined;

    return {
      ..._.pick(terryMappedById[terryCheckin.terryId], [
        'id',
        'metadata',
        'name',
      ]),
      location: {
        latitude: terryMappedById[terryCheckin.terryId].location.coordinates[1],
        longitude:
          terryMappedById[terryCheckin.terryId].location.coordinates[0],
      },
    };
  }

  async getTerryMappedById(
    terryCheckinList: Document2Interface<TerryCheckinDocument>[],
  ) {
    const terryIds = _.uniq(
      terryCheckinList.map((terryCheckin) => terryCheckin.terryId),
    );
    const terryData = await this.terryRepo.find({
      _id: { $in: terryIds },
    });
    return _.mapKeys(terryData, 'id');
  }
}
