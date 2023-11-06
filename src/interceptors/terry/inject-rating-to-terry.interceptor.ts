import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { from } from 'rxjs';
import { TerryDocument } from 'src/modules/terry/terry.model';
import { convertObject } from 'src/shared/mongoose/helpers';
import { Document2Interface } from 'src/shared/mongoose/types';
import _ from 'lodash';
import { mergeMap } from 'rxjs/operators';
import { TerryUserMappingRepository } from 'src/modules/terry-user-mapping/terry-user-mapping.repository';
import { TerryUserMappingDocument } from 'src/modules/terry-user-mapping/terry-user-mapping.model';

@Injectable()
export class InjectRatingToTerryInterceptor implements NestInterceptor {
  constructor(
    private readonly terryUserMappingRepo: TerryUserMappingRepository,
  ) {}
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<
      Document2Interface<TerryDocument> | Document2Interface<TerryDocument>[]
    >,
  ) {
    return next
      .handle()
      .pipe(mergeMap((data) => from(this.injectData(convertObject(data)))));
  }

  async injectData(
    data:
      | Document2Interface<TerryDocument>
      | Document2Interface<TerryDocument>[],
  ) {
    const terryUserMappingDataMappedByTerryId =
      await this.getTerryUserMappingMappedByTerryId(
        Array.isArray(data) ? data : [data],
      );
    if (Array.isArray(data)) {
      data.forEach((terry) => {
        (terry as any).rating = this.addRatingToTerry(
          terryUserMappingDataMappedByTerryId[terry.id] || [],
        );
      });
    } else {
      (data as any).rating = this.addRatingToTerry(
        terryUserMappingDataMappedByTerryId[data.id] || [],
      );
    }
    return data;
  }

  addRatingToTerry(terryUserMappingData: TerryUserMappingDocument[]) {
    if (_.isEmpty(terryUserMappingData))
      return {
        rate: 5,
        total: 0,
      };
    const totalRating = terryUserMappingData.reduce(
      (accumulator, current) => accumulator + (current?.rate || 0),
      0,
    );
    if (totalRating === 0) return 5;
    return {
      rate: totalRating / terryUserMappingData.length,
      total: terryUserMappingData.length,
    };
  }

  async getTerryUserMappingMappedByTerryId(
    terries: Document2Interface<TerryDocument>[],
  ) {
    const terryIds = terries.map((terry) => terry.id);
    const terryUserMappingData = await this.terryUserMappingRepo.find({
      terryId: { $in: terryIds },
    });
    return _.groupBy(terryUserMappingData, 'terryId');
  }
}
