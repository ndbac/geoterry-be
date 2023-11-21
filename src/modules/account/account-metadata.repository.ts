import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/mongoose/base.repository';
import { CollectionName } from 'src/shared/types';
import { AccountMetadataDocument } from './account-metadata.model';

@Injectable()
export class AccountMetadataRepository
  extends BaseRepository<AccountMetadataDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(CollectionName.ACCOUNT_METADATA)
    model: Model<AccountMetadataDocument>,
  ) {
    super(model);
  }

  throwErrorNotFound(): never {
    throw new NotFoundException({
      message: 'Cannot find this account metadata',
      sentryAlertDisabled: true,
    });
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
