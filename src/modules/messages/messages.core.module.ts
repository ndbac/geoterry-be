import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionName } from 'src/shared/types';
import { MessageDocument } from './messages.model';
import { MessageRepository } from './messages.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CollectionName.MESSAGES,
        schema: MessageDocument.schema,
      },
    ]),
  ],
  providers: [MessageRepository],
  exports: [MessageRepository],
})
export class MessageCoreModule {}
