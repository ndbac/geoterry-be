import { Injectable } from '@nestjs/common';
import { TerryCategoryRepository } from '../terry-category.repository';
import _ from 'lodash';
import { FilterTerryCategoryInputDto } from '../dto/terry-category.dto';

@Injectable()
export class PublicTerryCategroyService {
  constructor(private readonly terryCategoryRepo: TerryCategoryRepository) {}

  async readCategories(input: FilterTerryCategoryInputDto) {
    return this.terryCategoryRepo.find({
      ...(!_.isEmpty(input.categoryIds)
        ? { _id: { $in: input.categoryIds } }
        : []),
    });
  }
}
