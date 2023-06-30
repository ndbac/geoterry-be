import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorCode } from 'src/errors/error-defs';
import { throwStandardError } from 'src/errors/helpers';
import { BaseRepository } from 'src/shared/mongoose/base.repository';
import { CollectionName } from 'src/shared/types';
import { ProfileDocument } from './profile.model';

@Injectable()
export class ProfileRepository
  extends BaseRepository<ProfileDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(CollectionName.PROFILES)
    model: Model<ProfileDocument>,
  ) {
    super(model);
  }

  throwErrorNotFound() {
    return throwStandardError(ErrorCode.PROFILE_NOT_FOUND);
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
