import { Db } from 'mongodb';
import { CollectionName } from 'src/shared/types';

export = {
  async up(db: Db) {
    await db.collection(CollectionName.STORES).createIndex(
      {
        userId: 1,
        slug: 1,
      },
      { name: 'identifier_1_slug_1' },
    );
  },
  async down(db: Db) {
    await db.collection(CollectionName.STORES).dropIndex('identifier_1_slug_1');
  },
};
