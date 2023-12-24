import { Db } from 'mongodb';
import { CollectionName } from 'src/shared/types';

export = {
  async up(db: Db) {
    await db.collection(CollectionName.CONVERSATIONS).createIndex(
      {
        participants: 1,
      },
      { name: 'participants_1' },
    );

    await db.collection(CollectionName.MESSAGES).createIndex(
      {
        conversationId: 1,
      },
      { name: 'conversationId_1' },
    );
  },
  async down(db: Db) {
    await db
      .collection(CollectionName.CONVERSATIONS)
      .dropIndex('participants_1');

    await db.collection(CollectionName.MESSAGES).dropIndex('conversationId_1');
  },
};
