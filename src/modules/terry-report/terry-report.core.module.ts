import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionName } from 'src/shared/types';
import { TerryReportDocument } from './terry-report.model';
import { TerryReportRepository } from './terry-report.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CollectionName.TERRY_REPORTS,
        schema: TerryReportDocument.schema,
      },
    ]),
  ],
  providers: [TerryReportRepository],
  exports: [TerryReportRepository],
})
export class TerryReportCoreModule {}
