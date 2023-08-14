import { throwStandardError } from '../../../errors/helpers';
import { Injectable } from '@nestjs/common';
import { TerryCategoryRepository } from '../terry-category.repository';
import _ from 'lodash';
import { ErrorCode } from 'src/errors/error-defs';
import {
  FilterTerryCategoryInputDto,
  TerryCategoryInputDto,
  UpdateTerryCategoryInputDto,
} from '../dto/terry-category.dto';

@Injectable()
export class TerryCategroyService {
  constructor(private readonly terryCategoryRepo: TerryCategoryRepository) {}

  async createCategory(data: TerryCategoryInputDto) {
    const category = await this.terryCategoryRepo.findOne({
      name: data.name,
    });
    if (category) {
      return throwStandardError(ErrorCode.DUPLICATED_NAME);
    }
    return this.terryCategoryRepo.create({
      name: data.name,
      description: data?.description,
    });
  }

  async updateCategory(categoryId: string, data: UpdateTerryCategoryInputDto) {
    await this.terryCategoryRepo.findByIdOrFail(categoryId);
    if (data.name) {
      const existedName = await this.terryCategoryRepo.exists({
        name: data.name,
      });
      if (existedName) {
        return throwStandardError(ErrorCode.DUPLICATED_NAME);
      }
    }

    return this.terryCategoryRepo.updateById(categoryId, data);
  }

  async deleteCategoryById(categoryId: string) {
    return this.terryCategoryRepo.deleteById(categoryId);
  }

  async readCategoryById(categoryId: string) {
    return this.terryCategoryRepo.findByIdOrFail(categoryId);
  }

  async readCategories(input: FilterTerryCategoryInputDto) {
    return this.terryCategoryRepo.find({
      ...(!_.isEmpty(input.categoryIds)
        ? { _id: { $in: input.categoryIds } }
        : []),
    });
  }
}
