import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionName } from 'src/shared/types';
import { TerryCategoryDocument } from './terry-category.model';
import { TerryCategoryRepository } from './terry-category.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CollectionName.TERRY_CATEGORIES,
        schema: TerryCategoryDocument.schema,
      },
    ]),
  ],
  providers: [TerryCategoryRepository],
  exports: [TerryCategoryRepository],
})
export class TerryCategoryCoreModule {}
