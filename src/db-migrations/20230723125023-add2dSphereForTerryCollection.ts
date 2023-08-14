import { Db } from 'mongodb';
import { CollectionName } from 'src/shared/types';

export = {
  async up(db: Db) {
    await db.collection(CollectionName.TERRIES).createIndex(
      {
        'location.coordinates': '2dsphere',
      },
      { name: 'location_1' },
    );
  },
  async down(db: Db) {
    await db.collection(CollectionName.TERRIES).dropIndex('location_1');
  },
};
