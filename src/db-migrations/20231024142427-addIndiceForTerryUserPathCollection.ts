import { Db } from 'mongodb';
import { CollectionName } from 'src/shared/types';

export = {
  async up(db: Db) {
    await db.collection(CollectionName.TERRY_USER_PATHS).createIndex(
      {
        terryId: 1,
        profileId: 1,
      },
      { name: 'terryId_1_profileId_1' },
    );
  },
  async down(db: Db) {
    await db
      .collection(CollectionName.TERRY_USER_PATHS)
      .dropIndex('terryId_1_profileId_1');
  },
};
