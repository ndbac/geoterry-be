import { TerryCategoryRepository } from './../../modules/terry-category/terry-category.repository';
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
import { TerryCategoryDocument } from 'src/modules/terry-category/terry-category.model';

@Injectable()
export class InjectCategoriesToTerryInterceptor implements NestInterceptor {
  constructor(private readonly terryCategoryRepo: TerryCategoryRepository) {}
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<
      Document2Interface<TerryDocument> | Document2Interface<TerryDocument>[]
    >,
  ) {
    if (ctx.switchToHttp().getRequest().query['includeCategoryData'] !== 'true')
      return next.handle();
    return next
      .handle()
      .pipe(mergeMap((data) => from(this.injectData(convertObject(data)))));
  }

  async injectData(
    data:
      | Document2Interface<TerryDocument>
      | Document2Interface<TerryDocument>[],
  ) {
    const categoryMappedById = await this.getCategoriesMappedById(
      Array.isArray(data) ? data : [data],
    );
    if (Array.isArray(data)) {
      data.forEach((terry) => {
        if (terry.categoryIds) {
          (terry as any).categories = this.addCategoriesToTerry(
            terry,
            categoryMappedById,
          );
        }
      });
    } else {
      (data as any).categories = this.addCategoriesToTerry(
        data,
        categoryMappedById,
      );
    }
    return data;
  }

  addCategoriesToTerry(
    terry: Document2Interface<TerryDocument>,
    categoryMappedById: _.Dictionary<TerryCategoryDocument>,
  ) {
    if (_.isEmpty(terry.categoryIds)) return undefined;
    return terry.categoryIds?.map(
      (categoryId) => categoryMappedById[categoryId],
    );
  }

  async getCategoriesMappedById(terries: Document2Interface<TerryDocument>[]) {
    const categoryIds = _.uniq(
      _.flatten(terries.map((terry) => terry.categoryIds)),
    );
    const categoryData = await this.terryCategoryRepo.find({
      _id: { $in: categoryIds },
    });
    return _.mapKeys(categoryData, 'id');
  }
}
