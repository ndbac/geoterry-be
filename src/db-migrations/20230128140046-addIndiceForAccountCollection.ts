import { Db } from 'mongodb';
import { CollectionName } from 'src/shared/types';

export = {
  async up(db: Db) {
    await db.collection(CollectionName.ACCOUNTS).createIndex(
      {
        identifier: 1,
        identifierType: 1,
      },
      { name: 'identifier_1_identifierType_1', unique: true },
    );
  },
  async down(db: Db) {
    await db
      .collection(CollectionName.ACCOUNTS)
      .dropIndex('identifier_1_identifierType_1');
  },
};
