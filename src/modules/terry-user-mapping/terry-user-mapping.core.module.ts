import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionName } from 'src/shared/types';
import { TerryUserMappingDocument } from './terry-user-mapping.model';
import { TerryUserMappingRepository } from './terry-user-mapping.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CollectionName.TERRY_USER_MAPPINGS,
        schema: TerryUserMappingDocument.schema,
      },
    ]),
  ],
  providers: [TerryUserMappingRepository],
  exports: [TerryUserMappingRepository],
})
export class TerryUserMappingCoreModule {}
