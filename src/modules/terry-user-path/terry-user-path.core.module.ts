import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionName } from 'src/shared/types';
import { TerryUserPathDocument } from './terry-user-path.model';
import { TerryUserPathRepository } from './terry-user-path.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CollectionName.TERRY_USER_PATHS,
        schema: TerryUserPathDocument.schema,
      },
    ]),
  ],
  providers: [TerryUserPathRepository],
  exports: [TerryUserPathRepository],
})
export class TerryUserPathCoreModule {}
