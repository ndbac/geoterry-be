import { Db } from 'mongodb';
import { CollectionName } from 'src/shared/types';

export = {
  async up(db: Db) {
    await db
      .collection(CollectionName.PROFILES)
      .updateMany({ userId: { $exists: true } }, { $set: { rewardPoints: 0 } });
  },
  async down(db: Db) {
    await db
      .collection(CollectionName.PROFILES)
      .updateMany(
        { userId: { $exists: true } },
        { $set: { rewardPoints: undefined } },
      );
  },
};
