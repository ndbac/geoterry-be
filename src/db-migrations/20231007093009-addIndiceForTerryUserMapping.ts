import { Db } from 'mongodb';
import { CollectionName } from 'src/shared/types';

export = {
  async up(db: Db) {
    await db.collection(CollectionName.TERRY_USER_MAPPINGS).createIndex(
      {
        terryId: 1,
      },
      { name: 'terryId_1' },
    );

    await db.collection(CollectionName.TERRY_USER_MAPPINGS).createIndex(
      {
        profileId: 1,
        terryId: 1,
      },
      { name: 'profileId_1_terryId_1' },
    );
  },
  async down(db: Db) {
    await db
      .collection(CollectionName.TERRY_USER_MAPPINGS)
      .dropIndex('terryId_1');

    await db
      .collection(CollectionName.TERRY_USER_MAPPINGS)
      .dropIndex('profileId_1_terryId_1');
  },
};
