import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionName } from 'src/shared/types';
import { ConversationDocument } from './conversations.model';
import { ConversationRepository } from './conversations.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CollectionName.CONVERSATIONS,
        schema: ConversationDocument.schema,
      },
    ]),
  ],
  providers: [ConversationRepository],
  exports: [ConversationRepository],
})
export class ConversationCoreModule {}
