import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/mongoose/base.repository';
import { CollectionName } from 'src/shared/types';
import { AccountDocument } from './accounts.model';

@Injectable()
export class AccountRepository
  extends BaseRepository<AccountDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(CollectionName.ACCOUNTS)
    model: Model<AccountDocument>,
  ) {
    super(model);
  }

  throwErrorNotFound(): never {
    throw new NotFoundException({
      message: 'Cannot find this account',
      sentryAlertDisabled: true,
    });
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
