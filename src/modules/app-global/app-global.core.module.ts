import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionName } from 'src/shared/types';
import { AppGlobalDocument } from './app-global.model';
import { AppGlobalRepository } from './app-global.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CollectionName.APP_GLOBALS,
        schema: AppGlobalDocument.schema,
      },
    ]),
  ],
  providers: [AppGlobalRepository],
  exports: [AppGlobalRepository],
})
export class AppGlobalCoreModule {}
