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
export class InjectTerryUserCustomDataInterceptor implements NestInterceptor {
  constructor(
    private readonly terryUserMappingRepo: TerryUserMappingRepository,
  ) {}
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<
      Document2Interface<TerryDocument> | Document2Interface<TerryDocument>[]
    >,
  ) {
    const profileId = ctx.switchToHttp().getRequest().params?.profileId;
    const shouldInjectPath =
      ctx.switchToHttp().getRequest().query['includeUserPath'] === 'true';
    return next
      .handle()
      .pipe(
        mergeMap((data) =>
          from(
            this.injectData(convertObject(data), profileId, shouldInjectPath),
          ),
        ),
      );
  }

  async injectData(
    data:
      | Document2Interface<TerryDocument>
      | Document2Interface<TerryDocument>[],
    profileId: string,
    shouldInjectPath?: boolean,
  ) {
    const terryUserMappingDataMappedByTerryId =
      await this.getTerryUserMappingMappedByTerryId(
        Array.isArray(data) ? data : [data],
        profileId,
      );
    if (Array.isArray(data)) {
      data.forEach((terry) => {
        this.addData(
          terry,
          terryUserMappingDataMappedByTerryId[terry.id],
          shouldInjectPath,
        );
      });
    } else {
      this.addData(
        data,
        terryUserMappingDataMappedByTerryId[data.id],
        shouldInjectPath,
      );
    }
    return data;
  }

  addData(
    terry: Document2Interface<TerryDocument>,
    terryUserMappingData: TerryUserMappingDocument,
    shouldInjectPath?: boolean,
  ) {
    if (!terryUserMappingData) return;
    if (terryUserMappingData.favourite) {
      (terry as any).favourite = terryUserMappingData.favourite;
    }
    if (terryUserMappingData.saved) {
      (terry as any).saved = terryUserMappingData.saved;
    }
    if (terryUserMappingData.checkedIn) {
      (terry as any).checkedIn = terryUserMappingData.checkedIn;
    }
    if (terryUserMappingData.path && shouldInjectPath) {
      (terry as any).path = terryUserMappingData.path;
    }
  }

  async getTerryUserMappingMappedByTerryId(
    terries: Document2Interface<TerryDocument>[],
    profileId: string,
  ) {
    const terryIds = terries.map((terry) => terry.id);
    const terryUserMappingData = await this.terryUserMappingRepo.find({
      terryId: { $in: terryIds },
      profileId,
    });
    return _.mapKeys(terryUserMappingData, 'terryId');
  }
}
