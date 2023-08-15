import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionName } from 'src/shared/types';
import { TerryCheckinDocument } from './terry-checkin.model';
import { TerryCheckinRepository } from './terry-checkin.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CollectionName.TERRY_CHECKINS,
        schema: TerryCheckinDocument.schema,
      },
    ]),
  ],
  providers: [TerryCheckinRepository],
  exports: [TerryCheckinRepository],
})
export class TerryCheckinCoreModule {}
