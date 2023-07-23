import { TerryDocument } from './terry.model';
import { TerryRepository } from './terry.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionName } from 'src/shared/types';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CollectionName.TERRIES, schema: TerryDocument.schema },
    ]),
  ],
  providers: [TerryRepository],
  exports: [TerryRepository],
})
export class TerryCoreModule {}
