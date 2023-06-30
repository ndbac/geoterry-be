import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionName } from 'src/shared/types';
import { StoreDocument } from './store.model';
import { StoreRepository } from './store.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CollectionName.STORES, schema: StoreDocument.schema },
    ]),
  ],
  providers: [StoreRepository],
  exports: [StoreRepository],
})
export class StoreCoreModule {}
