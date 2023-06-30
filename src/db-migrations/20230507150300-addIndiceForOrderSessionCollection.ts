import { Db } from 'mongodb';
import { CollectionName } from 'src/shared/types';

export = {
  async up(db: Db) {
    await db.collection(CollectionName.ORDER_SESSIONS).createIndex(
      {
        username: 1,
        tableId: 1,
      },
      { name: 'username_1_tableId_1' },
    );
    await db.collection(CollectionName.ORDER_SESSIONS).createIndex(
      {
        storeId: 1,
        tableId: 1,
        username: 1,
      },
      { name: 'storeId_1_tableId_1_username_1' },
    );
  },
  async down(db: Db) {
    await db
      .collection(CollectionName.ORDER_SESSIONS)
      .dropIndex('username_1_tableId_1');
    await db
      .collection(CollectionName.ORDER_SESSIONS)
      .dropIndex('storeId_1_tableId_1_username_1');
  },
};
