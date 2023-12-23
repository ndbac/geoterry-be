import { Db } from 'mongodb';
import { CollectionName } from 'src/shared/types';

export = {
  async up(db: Db) {
    await db.collection(CollectionName.PROFILES).createIndex(
      {
        lastLocation: '2dsphere',
      },
      { name: 'lastLocation_1' },
    );
  },
  async down(db: Db) {
    await db.collection(CollectionName.PROFILES).dropIndex('lastLocation_1');
  },
};
