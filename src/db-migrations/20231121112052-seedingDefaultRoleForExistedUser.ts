import { Db } from 'mongodb';
import { CollectionName, IAccountRole } from 'src/shared/types';

export = {
  async up(db: Db) {
    await db
      .collection(CollectionName.ACCOUNTS)
      .updateMany(
        { role: { $exists: false } },
        { $set: { role: IAccountRole.USER } },
      );
  },
  async down(db: Db) {
    await db
      .collection(CollectionName.ACCOUNTS)
      .updateMany({ role: { $exists: true } }, { $set: { role: undefined } });
  },
};
