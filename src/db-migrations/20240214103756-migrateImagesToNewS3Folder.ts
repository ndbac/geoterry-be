import { Db } from 'mongodb';
import { CollectionName } from 'src/shared/types';

export = {
  async up(db: Db) {
    await db
      .collection(CollectionName.TERRIES)
      .updateMany(
        { photoUrls: { $exists: true } },
        { $set: { photoUrls: null } },
      );

    await db
      .collection(CollectionName.TERRY_CHECKINS)
      .updateMany(
        { photoUrls: { $exists: true } },
        { $set: { photoUrls: null } },
      );
  },
};
