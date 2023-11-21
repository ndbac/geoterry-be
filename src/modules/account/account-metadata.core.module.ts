import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionName } from 'src/shared/types';
import { AccountMetadataRepository } from './account-metadata.repository';
import { AccountMetadataDocument } from './account-metadata.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CollectionName.ACCOUNT_METADATA,
        schema: AccountMetadataDocument.schema,
      },
    ]),
  ],
  providers: [AccountMetadataRepository],
  exports: [AccountMetadataRepository],
})
export class AccountMetadataCoreModule {}
