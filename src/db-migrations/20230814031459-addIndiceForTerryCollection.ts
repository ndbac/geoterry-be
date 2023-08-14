import { Db } from 'mongodb';
import { CollectionName } from 'src/shared/types';

export = {
  async up(db: Db) {
    await db.collection(CollectionName.TERRIES).createIndex(
      {
        profileId: 1,
        categoryIds: 1,
      },
      { name: 'profileId_1_categoryIds_1' },
    );
  },
  async down(db: Db) {
    await db
      .collection(CollectionName.TERRIES)
      .dropIndex('profileId_1_categoryIds_1');
  },
};
