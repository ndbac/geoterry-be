import { Db } from 'mongodb';
import { CollectionName } from 'src/shared/types';

export = {
  async up(db: Db) {
    await db.collection(CollectionName.TERRIES).updateMany(
      {
        address: { $exists: true },
      },
      { $set: { address: null } },
    );
  },
};
