import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionName } from 'src/shared/types';
import { ProfileDocument } from './profile.model';
import { ProfileRepository } from './profile.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CollectionName.PROFILES, schema: ProfileDocument.schema },
    ]),
  ],
  providers: [ProfileRepository],
  exports: [ProfileRepository],
})
export class ProfileCoreModule {}
