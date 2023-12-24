import { Db } from 'mongodb';
import { CollectionName } from 'src/shared/types';

export = {
  async up(db: Db) {
    await db
      .collection(CollectionName.PROFILES)
      .updateMany(
        { userId: { $exists: true } },
        { $set: { totalCheckedinTerry: 0 } },
      );
    await db
      .collection(CollectionName.TERRY_CHECKINS)
      .updateMany({ terryId: { $exists: true } }, { $set: { isFound: true } });
  },
  async down(db: Db) {
    await db
      .collection(CollectionName.PROFILES)
      .updateMany(
        { totalCheckedinTerry: { $exists: true } },
        { $set: { totalCheckedinTerry: undefined } },
      );
    await db
      .collection(CollectionName.TERRY_CHECKINS)
      .updateMany(
        { terryId: { $exists: true } },
        { $set: { isFound: undefined } },
      );
  },
};
