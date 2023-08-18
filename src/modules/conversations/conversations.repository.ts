import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/mongoose/base.repository';
import { CollectionName } from 'src/shared/types';
import { ConversationDocument } from './conversations.model';

@Injectable()
export class ConversationRepository
  extends BaseRepository<ConversationDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(CollectionName.CONVERSATIONS)
    model: Model<ConversationDocument>,
  ) {
    super(model);
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
