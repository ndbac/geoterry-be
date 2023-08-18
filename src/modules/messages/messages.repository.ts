import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/mongoose/base.repository';
import { CollectionName } from 'src/shared/types';
import { MessageDocument } from './messages.model';

@Injectable()
export class MessageRepository
  extends BaseRepository<MessageDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(CollectionName.MESSAGES)
    model: Model<MessageDocument>,
  ) {
    super(model);
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
